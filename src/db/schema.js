import { pgTable,serial,text,integer, timestamp } from "drizzle-orm/pg-core";

export const pacientes = pgTable('pacientes',{
    id: serial('id').primaryKey(),
    nome: text('nome').notNull(),
    idade: integer('idade').notNull(),
    urgencia: text('urgencia').notNull()
})

export const consultas = pgTable('consultas',{
    id: serial('id').primaryKey(),
    descricao: text('descricao').notNull(),
    data: timestamp().defaultNow(),

    pacienteId: integer('paciente_id').notNull()
    .references(()=> pacientes.id)
})