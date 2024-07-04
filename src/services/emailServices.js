const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();
const dataSource = require('../models');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const fs = require('fs').promises;
const path = require('path');

class EmailServices {
    constructor() {
        this.sesClient = new SESClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    }

    async salvarErro(exception, mensagem) {
        const erro = {
            exception: exception,
            message: mensagem,
        };
        try {
            await dataSource.Fracaso.create(erro);
            console.log('Erro salvo com sucesso');
        } catch (error) {
            console.error('Falha ao salvar o erro no banco de dados:', error);
            throw error;
        }
    }

    async buscarEmail(id_reservista) {
        const participante = await dataSource.Usuario.findOne({
            attributes: ['email'],
            where: { id: id_reservista }
        });
        if (!participante) {
            throw new Error('Participante não encontrado');
        }
        return participante.email;
    }

    async enviarEmail(toUserEmail, body, subject) {
        const params = {
            Destination: {
                ToAddresses: [toUserEmail]
            },
            Message: {
                Body: {
                    Html: {
                        Data: body
                    }
                },
                Subject: {
                    Data: subject
                }
            },
            Source: process.env.EMAIL_FROM
        };

        try {
            const command = new SendEmailCommand(params);
            const result = await this.sesClient.send(command);
            console.log('E-mail enviado com sucesso:', result);
            return result;
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            await this.salvarErro(error.name, error.message);
            throw error;
        }
    }

    async embedCssInHtml(htmlPath, cssPath) {
        try {
            const [htmlContent, cssContent] = await Promise.all([
                fs.readFile(htmlPath, 'utf8'),
                fs.readFile(cssPath, 'utf8')
            ]);
            const htmlWithCss = htmlContent.replace('</head>', `<style>${cssContent}</style></head>`);
            return htmlWithCss;
        } catch (error) {
            console.error('Erro ao ler arquivos HTML ou CSS:', error);
            throw error;
        }
    }

    async enviarEmailConfirmacao(novoRegistro) {
        try {
            const toUserEmail = await this.buscarEmail(novoRegistro.idUsuario);
            const emailTemplatePath = path.join(__dirname, '../email/corpo_email/confirmacao.html');
            const cssPath = path.join(__dirname, '../email/style/style.css');
            const body = await this.embedCssInHtml(emailTemplatePath, cssPath);
            return await this.enviarEmail(toUserEmail, body, 'Confirmação de reserva - CIPT');
        } catch (error) {
            console.error('Erro ao enviar e-mail de confirmação:', error);
            await this.salvarErro(error.name, error.message);
            throw error;
        }
    }

    async enviarEmailCancelamento(reserva) {
        try {
            const toUserEmail = await this.buscarEmail(reserva.idUsuario);
            const emailTemplatePath = path.join(__dirname, '../email/corpo_email/cancelamento.html');
            const cssPath = path.join(__dirname, '../email/style/style.css');
            const body = await this.embedCssInHtml(emailTemplatePath, cssPath);
            return await this.enviarEmail(toUserEmail, body, 'Sua reserva foi cancelada - CIPT');
        } catch (error) {
            console.error('Erro ao enviar e-mail de cancelamento:', error);
            await this.salvarErro(error.name, error.message);
            throw error;
        }
    }
}

module.exports = EmailServices;
