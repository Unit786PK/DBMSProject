//psql 'postgresql://neondb_owner:npg_2TAMCvdn1wap@ep-silent-recipe-ade6brub-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
import {neon} from "@neondatabase/serverless"
export const sql = neon('postgresql://neondb_owner:npg_2TAMCvdn1wap@ep-silent-recipe-ade6brub-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

