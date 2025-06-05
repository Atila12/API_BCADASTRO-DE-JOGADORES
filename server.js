import express from "express"
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { z, ZodError } from "zod"

const prisma = new PrismaClient()

const app = express()

// função para buscar informações por padrão express não .json
app.use(express.json())
app.use(cors())

app.post('/usuarios', async (req, res) => {

    try {
        const userSchema = z.object({
            nome: z.string().min(1).max(20, "Deve conter no máixmo 20 caracteres"),
            setor: z.string().min(1).max(10, "Deve conter no máximo 10 caracteres"),
            lider: z.string().min(1).max(15, "Deve conter no máixmo 15 caracteres"),
            posicao: z.string().min(1).max(20, "Deve conter no máixmo 20 caracteres"),
            telefone: z.string().min(1).max(20, "Deve conter no máixmo 15 caracteres"),
        })

        const data = userSchema.parse(req.body)

        await prisma.user.create({
            data: {
                nome: data.nome,
                setor: data.setor,
                lider: data.lider,
                posicao: data.posicao,
                telefone: data.telefone,
            }
        })

        return res.status(201).json(data)
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send({
                message: "Erro de validação",
                erro: error.flatten()
            })
        }

        return res.status(500).send({ message: "Erro ao tentar criar usuário" })
    }
});
// função para trazer as informações enviadas pelo post
app.get('/usuarios', async (req, res) => {

    console.log(req)

    const users = await prisma.user.findMany()

    res.status(200).json(users)
});

// função para atualizar informações.
app.put('/usuarios/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            nome: req.body.nome,
            setor: req.body.setor,
            lider: req.body.lider,
            posicao: req.body.posicao,
            telefone: req.body.telefone,
        }
    })

    res.status(201).json(req.body)
})

// função para deletar as informações no banco e no front em tempo real
app.delete('/usuarios/:id', async (req, res) => {

    await prisma.user.delete({
        where: {
            id: req.params.id,
        },
    })
    res.status(201).json({ message: "Usuário deletado com sucesso!" })
})

app.listen(3000, () => console.log('API iniciada na porta 3000'))
