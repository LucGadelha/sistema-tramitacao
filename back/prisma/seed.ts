import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.tipoDocumento.createMany({
    data: [
        { descricao: 'Ofício' },
        { descricao: 'Memorando de Entendimento' },
    ],
    skipDuplicates: true,
    });

    console.log("Tipos de documento inseridos com sucesso!");
    await prisma.setor.createMany({
    data: [
        { sigla: 'RH', descricao: 'Recursos Humanos' },
        { sigla: 'DR', descricao: 'Diretoria' },
    ],
    skipDuplicates: true,
    });

    console.log("Setores inseridos com sucesso!");
}



main()
    .catch((e) => {
    console.error("Erro ao executar seed:", e);
    process.exit(1);
    })
    .finally(async () => {
    await prisma.$disconnect();
});