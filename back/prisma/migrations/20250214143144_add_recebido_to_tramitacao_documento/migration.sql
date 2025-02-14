/*
  Warnings:

  - You are about to drop the column `dataEnvio` on the `tramitacaodocumento` table. All the data in the column will be lost.
  - You are about to drop the column `dataRecebimento` on the `tramitacaodocumento` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `TramitacaoDocumento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tramitacaodocumento`
DROP COLUMN `dataEnvio`,
DROP COLUMN `dataRecebimento`,
ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
ADD COLUMN `recebido` BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
    
