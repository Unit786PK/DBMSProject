function App(){
  return {
    students: [],
    student: {},
    marks: [],
    semesterGpas: [],
    cgpa: null,
    loading: false,   // 👈 Add this line

    async getStudents(){
      const response = await fetch(`/api/students`).then(res => res.json());
      this.students = response;
    },

    async Detail(regno){
      this.loading = true;
// console.log("Alpine student before set:", this.student);
// this.student = response.student || { regno };
// console.log("Alpine student after set:", this.student);

      try {
        const res = await fetch(`/api/students/${regno}/marks`);
        const response = await res.json();
        console.log("Detail response:", response);

        if (response.student) this.student = response.student;
        if (response.courses) this.marks = response.courses;
        if (response.semesterGpas) this.semesterGpas = response.semesterGpas;
        if (response.cgpa !== undefined) this.cgpa = response.cgpa;

      } catch (err) {
        console.error("Error fetching details", err);
      } finally {
        this.loading = false;
      }
    }
  }
}
window.App = App;