/**
 * @author Lothaire Guée
 * @description
 *      Contains the command 'certify'.
 *      Allow mods to certify someone in the server.
 */

/*      IMPORTS      */
const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { CommandInteraction } = require( "discord.js" );
const { dbModifyPresentation, getSetupData } = require("../../utils/enmapUtils")

/*      AUTHORISATION      */
const { Presentation } = require('../../files/modules.js');
 
/* ----------------------------------------------- */
/* COMMAND BUILD                                   */
/* ----------------------------------------------- */
 const slashCommand = new SlashCommandBuilder()
     .setName( "p_modify" )
     .setDescription( "Modifier votre présentation." )
     .setDefaultPermission( false )
 
/* ----------------------------------------------- */
/* PERMISSIONS                                     */
/* ----------------------------------------------- */

async function permissions(guild){
	const permissions = [
		{
			id: guild,
			type: 'ROLE',
			permission: true,
		},
	];
	return permissions;
}

 /* ----------------------------------------------- */
 /* FUNCTIONS                                       */
 /* ----------------------------------------------- */
 /**
  * Function called when the command 'ping'
  * @param {CommandInteraction} interaction The interaction generated by the command's execution.
  */
  async function execute( interaction ) {
    // CHECK
    if(Presentation == false) return;

    const PRESENTATION_ID = await getSetupData(interaction.guild.id, "presentation")
    dbModifyPresentation.set(interaction.member.id, true)
    interaction.guild.channels.cache.find(x => x.id === PRESENTATION_ID)   //channel presentation ID
        .permissionOverwrites.edit(interaction.member, {
            SEND_MESSAGES: true
        })

    await interaction.reply(
        { content: `Nous vous donnons accès à la modification de votre message dans <#877640807786635324>.`, ephemeral: true }
        //channel presentation ID
    );
     
 }
 
 
 /* ----------------------------------------------- */
 /* MODULE EXPORTS                                  */
 /* ----------------------------------------------- */
 module.exports = {
    data: slashCommand,
    permissions,
    execute
 }