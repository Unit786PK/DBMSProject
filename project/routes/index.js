import express from "express"
const router = express.Router();
import {sql} from "../db.js"

// small helper: fallback grade + gpa
function calculateGradeAndGpa(percentage) {
  if (percentage >= 90) return { grade: "A", gpa: 4.0 };
  if (percentage >= 85) return { grade: "A-", gpa: 3.5 };
  if (percentage >= 80) return { grade: "B+", gpa: 3.25 };
  if (percentage >= 75) return { grade: "B", gpa: 3.0 };
  if (percentage >= 70) return { grade: "C+", gpa: 2.5 };
  if (percentage >= 65) return { grade: "C", gpa: 2.25 };
  if (percentage >= 60) return { grade: "C-", gpa: 2.0 };
  if (percentage >= 50) return { grade: "D", gpa: 1.0 };
  return { grade: "F", gpa: 0 };
}


// get all students
router.get(`/students`, async (req, res) => {
  const students = await sql`SELECT * FROM student;`
  res.status(200).json(students);
});

// get one student by regno
router.get(`/students/:regno`, async (req, res) => {
  const { regno } = req.params;
  const student = await sql`SELECT * FROM student WHERE regno = ${regno};`
  res.status(200).json(student[0]);
});

// get marks, GPA, and CGPA for one student
// get aggregated course marks, grade, semester GPA and CGPA for one student
router.get(`/students/:regno/marks`, async (req, res) => {
  const { regno } = req.params;

  try {
    // get student (so we can return name too)
    const studentRows = await sql`
      SELECT * FROM student WHERE regno = ${regno};
    `;
    if (!studentRows[0]) return res.status(404).json({ error: "Student not found" });
    const student = studentRows[0];

    // per-course aggregates: earned_total + possible_total directly from SQL
    const courses = await sql`
      SELECT
        r.rid,
        r.semester,
        r.year,
        c.cid,
        c.code AS course_code,
        c.title AS course_title,
        (
          COALESCE((
            SELECT SUM(m.marks)
            FROM marks m
            JOIN dist d ON d.hid = m.hid AND d.rid = m.rid
            WHERE m.rid = r.rid AND m.regno = ${regno}
          ), 0)
          +
          COALESCE((
            SELECT SUM(cm.marks)
            FROM cmarks cm
            JOIN cdist cd ON cd.hid = cm.hid AND cd.rid = cm.rid
            WHERE cm.rid = r.rid AND cm.regno = ${regno}
          ), 0)
        ) AS earned_total,
        (
          COALESCE((
            SELECT SUM(d.total)
            FROM dist d
            WHERE d.rid = r.rid
          ), 0)
          +
          COALESCE((
            SELECT SUM(cd.total)
            FROM cdist cd
            WHERE cd.rid = r.rid
          ), 0)
        ) AS possible_total,
        (c.theory + c.lab) AS credits
      FROM recap r
      JOIN course c ON r.cid = c.cid
      WHERE r.rid IN (
        SELECT rid FROM marks WHERE regno = ${regno}
        UNION
        SELECT rid FROM cmarks WHERE regno = ${regno}
      )
      ORDER BY r.year, r.semester, c.code;
    `;

    // load grading scale
    const gradeScale = await sql`SELECT * FROM grade ORDER BY gradeid;`;

    const courseRows = courses.map(row => {
      const earned_total = Number(row.earned_total);
      const possible_total = Number(row.possible_total);
      const percentage = possible_total === 0 ? 0 : (earned_total / possible_total) * 100;

      // try DB scale first
      let gradeRow = gradeScale.find(
        g => percentage >= Number(g.start) && percentage <= Number(g.end)
      );
      let grade = gradeRow ? gradeRow.grade : null;
      let gpa = gradeRow ? Number(gradeRow.gpa) : 0;

      // fallback if DB didn’t match
      if (!gradeRow) {
        const fallback = calculateGradeAndGpa(percentage);
        grade = fallback.grade;
        gpa = fallback.gpa;
      }
      return {
        rid: row.rid,
        semester: row.semester,
        year: row.year,
        cid: row.cid,
        course_code: row.course_code,
        course_title: row.course_title,
        earned_total: Number(earned_total.toFixed(2)),
        possible_total: Number(possible_total.toFixed(2)),
        percentage: Number(percentage.toFixed(2)),
        grade,
        gpa,
        credits: Number(row.credits) || 0
      };
    });

    // Calculate semester GPAs (weighted by credits), and CGPA (weighted across all courses)
    const semMap = {};
    let totalWeighted = 0;
    let totalCredits = 0;
    courseRows.forEach(c => {
      const semKey = `${c.year}-${c.semester}`;
      if (!semMap[semKey]) semMap[semKey] = { weightedSum: 0, creditsSum: 0 };
      semMap[semKey].weightedSum += c.gpa * (c.credits || 0);
      semMap[semKey].creditsSum += (c.credits || 0);
      totalWeighted += c.gpa * (c.credits || 0);
      totalCredits += (c.credits || 0);
    });

    const semesterGpas = Object.entries(semMap).map(([sem, data]) => {
      const gpa = data.creditsSum === 0 ? 0 : data.weightedSum / data.creditsSum;
      return { semester: sem, gpa: gpa.toFixed(2) };
    });

    const cgpa = totalCredits === 0 ? "0.00" : (totalWeighted / totalCredits).toFixed(2);

    res.status(200).json({
      student: { regno: student.regno, name: student.name },
      courses: courseRows,
      semesterGpas,
      cgpa
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;