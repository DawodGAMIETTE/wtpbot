/* eslint-disable no-case-declarations */
/**
 * @author Lothaire Guée
 * @description
 *      Contient la commande 'setup'.
 *      Allow admin to setup the JSON configuration file.
 */

/*      IMPORTS      */
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    setupMemes,
    setupSuggestions,
    setupThread,
    setupPresentations,
    setupArchives,
    setupCertify,
    setupWelcome,
    setupSupport,
    setupPremium,
} = require("../../utils/enmapUtils");

const { promisify } = require( "util" );
const { glob } = require( "glob" );
const globPromise = promisify( glob );

/*      AUTHORISATION      */
const { Setup } = require("../../files/modules.js");

/* ----------------------------------------------- */
/* COMMAND BUILD                                   */
/* ----------------------------------------------- */
const slashCommand = new SlashCommandBuilder()
    .setName("setup")
    .setDescription("[setup] Setup une fonctionnalité du bot sur ce serveur.")
    .setDefaultPermission(false)
    .addSubcommand((subcommand) =>
        subcommand
            .setName("memes")
            .setDescription(
                "Définir/Supprimer ce channel autorisable pour les memes."
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("suggestions")
            .setDescription(
                "Définir/Supprimer ce channel autorisable pour les propositions."
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("thread")
            .setDescription("Définir ce channel autorisable pour les threads.")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("welcome")
            .setDescription(
                "Définir/Supprimer le channel pour les bienvenus. (Il ne peut n'y en avoir qu'un)"
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("archives")
            .setDescription(
                "Définir/Supprimer le rôle pour les membres autorisés à accéder aux archives."
            )
            .addRoleOption((role) =>
                role
                    .setName("archives")
                    .setDescription(
                        "Le rôle pour les membres autorisés à accéder aux archives."
                    )
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("certify")
            .setDescription(
                "Définir/Supprimer les rôles de certification et de non-certification."
            )
            .addStringOption((string) =>
                string
                    .setName("certify_roles")
                    .setDescription(
                        "Entrez l'ID du/des rôles de certification qui seront à ajouter. (séparé d'une \",\" si plusieurs)"
                    )
            )
            .addStringOption((string) =>
                string
                    .setName("n_certify_roles")
                    .setDescription(
                        "Entrez l'ID du/des rôles de non-certification qui seront à enlever. (séparé d'une \",\" si plusieurs)"
                    )
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("premium")
            .setDescription(
                "Entrez l'ID du/des rôles Premium sur votre serveur. (séparé d'une \",\" si plusieurs)"
            )
            .addStringOption((string) =>
                string
                    .setName("premium_roles")
                    .setDescription(
                        "Entrez l'ID du/des rôles Premium sur votre serveur. (séparé d'une \",\" si plusieurs)"
                    )
            )
    );

    globPromise( `${process.cwd()}/plugins/*/commands/setup.js` ).then((pluginsSetup) => {
        pluginsSetup.map(file => {
            const setup = require( file );
            setup.addSetupCommand(slashCommand)
        });
    });

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Fonction appelé quand la commande est 'setup'
 * @param {CommandInteraction} interaction L'interaction généré par l'exécution de la commande.
 */
async function execute(interaction) {
    if (Setup == false) return;
    
    const pluginsSetup = await globPromise( `${process.cwd()}/plugins/*/commands/setup.js` );
    pluginsSetup.map(file => {
        const setup = require( file );
        setup.execute(interaction)
    });

    switch (interaction.options._subcommand) {
        case "memes":
            if (setupMemes.get(interaction.channel.id) === undefined) {
                setupMemes.set(interaction.channel.id, interaction.guild.id);
                await interaction.reply({
                    content: `Channel <#${interaction.channel.id}> ajouté à la liste des channels memes !`,
                    ephemeral: true,
                });
            } else {
                setupMemes.delete(interaction.channel.id);
                await interaction.reply({
                    content: `Channel <#${interaction.channel.id}> supprimé de la liste des channels memes !`,
                    ephemeral: true,
                });
            }
            break;
        case "suggestions":
            if (setupSuggestions.get(interaction.channel.id) === undefined) {
                setupSuggestions.set(
                    interaction.channel.id,
                    interaction.guild.id
                );
                await interaction.reply({
                    content: `Channel <#${interaction.channel.id}> ajouté à la liste des channels propositions !`,
                    ephemeral: true,
                });
            } else {
                setupSuggestions.delete(interaction.channel.id);
                await interaction.reply({
                    content: `Channel <#${interaction.channel.id}> supprimé de la liste des channels propositions !`,
                    ephemeral: true,
                });
            }
            break;
        case "thread":
            if (setupThread.get(interaction.channel.id) === undefined) {
                setupThread.set(interaction.channel.id, interaction.guild.id);
                await interaction.reply({
                    content: `Channel <#${interaction.channel.id}> ajouté à la liste des channels thread !`,
                    ephemeral: true,
                });
            } else {
                setupThread.delete(interaction.channel.id);
                await interaction.reply({
                    content: `Channel <#${interaction.channel.id}> supprimé de la liste des channels thread !`,
                    ephemeral: true,
                });
            }
            break;
        case "welcome":
            if (setupWelcome.get(interaction.guild.id) === undefined) {
                setupWelcome.set(interaction.guild.id, interaction.channel.id);
                await interaction.reply({
                    content: `Channel pour les bienvenus ajouté au serveur dans <#${interaction.channel.id}> !`,
                    ephemeral: true,
                });
            } else {
                setupWelcome.delete(interaction.guild.id);
                await interaction.reply({
                    content: `Channel pour les bienvenus supprimé du serveur !`,
                    ephemeral: true,
                });
            }
            break;
        case "archives":
            // eslint-disable-next-line no-case-declarations
            const archivesGet = await setupArchives.get(interaction.guild.id);
            if (archivesGet === undefined) {
                const roleId = interaction.options.getRole("archives").id;
                if (roleId != undefined) {
                    setupArchives.set(
                        interaction.guild.id,
                        interaction.options.getRole("archives").id
                    );
                    await interaction.reply({
                        content: `Rôle des archives ajouté au serveur ! (<@!${
                            interaction.options.getRole("archives").id
                        }>)`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: `Rôle à supprimer introuvable, vous devez spécifier un rôle si vous souhaitez l'ajouter.`,
                        ephemeral: true,
                    });
                }
            } else {
                setupArchives.delete(interaction.guild.id);
                await interaction.reply({
                    content: `Rôle des archives supprimé du serveur ! (<@!${archivesGet}>)`,
                    ephemeral: true,
                });
            }
            break;
        case "certify":
            // eslint-disable-next-line no-case-declarations
            const getCertify = interaction.options.getString("certify_roles");
            // eslint-disable-next-line no-case-declarations
            const getNCertify =
                interaction.options.getString("n_certify_roles");

            if (
                setupCertify.get(interaction.guild.id) === undefined ||
                getCertify != null ||
                undefined ||
                getNCertify != null ||
                undefined
            ) {
                if (
                    getCertify != null ||
                    undefined ||
                    getNCertify != null ||
                    undefined
                ) {
                    const certifyRoles = getCertify.split(",");
                    const nCertifyRoles = getNCertify.split(",");
                    setupCertify.set(interaction.guild.id, {
                        certifyRoles,
                        nCertifyRoles,
                    });
                    await interaction.reply({
                        content: `**Setup de la certification terminé !**\nCertifié : ${certifyRoles}\nNCertifié : ${nCertifyRoles}`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: `Setup de la certification à supprimer introuvable, vous devez spécifier les rôles avec des ID si vous souhaitez le configurer.`,
                        ephemeral: true,
                    });
                }
            } else {
                setupCertify.delete(interaction.guild.id);
                await interaction.reply({
                    content: `Setup de la certification supprimé !`,
                    ephemeral: true,
                });
            }
            break;
        case "premium":
            // eslint-disable-next-line no-case-declarations
            const premiumRoles = interaction.options
                .getString("premium_roles")
                .split(",");
            setupPremium.set(interaction.guild.id, premiumRoles);
            await interaction.reply({
                content: `**Setup des rôles premium terminés !**\nRôles premium : ${premiumRoles}`,
                ephemeral: true,
            });
            break;
        default:
            break;
    }
}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
    data: slashCommand,
    execute,
};
