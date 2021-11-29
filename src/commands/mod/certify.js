/**
 * @author Lothaire Guée
 * @description
 *      Contains the command 'certify'.
 *      Allow mods to certify someone in the server.
 */


 const { SlashCommandBuilder } = require( "@discordjs/builders" );
 const { CommandInteraction } = require( "discord.js" );
 
 
 /* ----------------------------------------------- */
 /* COMMAND BUILD                                   */
 /* ----------------------------------------------- */
 const slashCommand = new SlashCommandBuilder()
     .setName( "certify" )
     .setDescription( "Certifier une personne." )
     .setDefaultPermission( true )
     .addUserOption(option =>
        option.setName('user')
            .setDescription("Entrez l'utilisateur.")
            .setRequired(true));
 
/* ----------------------------------------------- */
/* PERMISSIONS                                     */
/* ----------------------------------------------- */

const permissions = [
    {
        id: '493118603655380992',
        type: 'USER',
        permission: true,
    },
];

 /* ----------------------------------------------- */
 /* FUNCTIONS                                       */
 /* ----------------------------------------------- */
 /**
  * Function called when the command 'ping'
  * @param {CommandInteraction} interaction The interaction generated by the command's execution.
  */
  async function execute( interaction ) {
    member = interaction.options.getMember('user')

    let rolea = interaction.guild.roles.cache.get("904760288073637939"); //Certifié
    let roleb = interaction.guild.roles.cache.get("875412331746709565"); //Non Certifié
    let rolec = interaction.guild.roles.cache.get("875412330828169249"); //Démo
    member.roles.add(rolea);
    member.roles.remove(roleb);
    member.roles.remove(rolec);

    await interaction.reply(
        { content: `Vous avez bien certifié <@${member.user.id}> !`, ephemeral: true }
    );
     
 }
 
 
 /* ----------------------------------------------- */
 /* MODULE EXPORTS                                  */
 /* ----------------------------------------------- */
 module.exports = {
     data: slashCommand,
     permissions: permissions,
     execute
 }