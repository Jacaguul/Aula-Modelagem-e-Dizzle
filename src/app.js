import express from 'express'
import 'dotenv/config'
import {db} from './db/index.js'
import { pacientes } from './db/schema.js'

const server = express()
server.use(express.json())

server.get('/pacientes', async (req, res)=>{
    try{
        const {id} = req.params
        const pacienteEncontrado = await db.select().from(pacientes).where(eq(pacientes.id, Number(id)))
        if(pacienteEncontrado.length === 0){
            res.status(404).json({erro: "Paciente não encontrado."})
        }
        const historicoConsultas = await db.select().from(consultas).where(eq(consultas.pacienteId, Number(id)))
        res.json({
            paciente: pacienteEncontrado[0],
            consultas: historicoConsultas
        })
    }catch(erro){
        res.status(500).json({erro: "Erro ao buscar detalhes do paciente."})
    }
})

server.put('/pacientes/:id', async (req, res)=>{
    try{
        const {id} = req.params
        const {urgencia} = req.body
        const pacienteAtualizado = await db.update(pacientes).set({urgencia}).where(eq(pacientes.id, Number(id))).returning()
        res.json({mensagem: "Urgencia atualizada com sucesso!", paciente: pacienteAtualizado[0]})
    }catch(erro){
        res.status(400).json({erro: "Erro ao atualizar o paciente."})
    }
})

server.post('/pacientes',async (req, res)=>{
    try{
        const {nome, idade, urgencia} = req.body

        const novoPaciente = await db.insert(pacientes).values({
            nome,
            idade,
            urgencia
        }).returning()
        res.status(201).json({
            mensagem: "Salvo no banco de dados com sucesso!",
            paciente: novoPaciente[0]
        })
        
    }catch(erro){
        res.status(400).json({erro: "Erro ao salvar no banco de dados."})
    }
})

server.listen(3000, ()=> console.log("Servidor rodando em http://localhost:3000"))