-- CreateTable
CREATE TABLE `Setor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sigla` VARCHAR(10) NOT NULL,
    `descricao` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `Setor_sigla_key`(`sigla`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TramitacaoDocumento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentoId` INTEGER NOT NULL,
    `setorEnvioId` INTEGER NOT NULL,
    `setorRecebeId` INTEGER NOT NULL,
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataRecebimento` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(10) NOT NULL,
    `titulo` VARCHAR(40) NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `arquivo` VARCHAR(100) NOT NULL,
    `tipoDocumentoId` INTEGER NOT NULL,

    UNIQUE INDEX `Documento_numero_key`(`numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoDocumento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TramitacaoDocumento` ADD CONSTRAINT `TramitacaoDocumento_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TramitacaoDocumento` ADD CONSTRAINT `TramitacaoDocumento_setorEnvioId_fkey` FOREIGN KEY (`setorEnvioId`) REFERENCES `Setor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TramitacaoDocumento` ADD CONSTRAINT `TramitacaoDocumento_setorRecebeId_fkey` FOREIGN KEY (`setorRecebeId`) REFERENCES `Setor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_tipoDocumentoId_fkey` FOREIGN KEY (`tipoDocumentoId`) REFERENCES `TipoDocumento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
