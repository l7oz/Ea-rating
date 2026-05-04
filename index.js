const {
    Client,
    GatewayIntentBits,
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits,
    MessageFlags,
} = require("discord.js");

const config = require("./config");

// ─── Client Setup ───────────────────────────────────────────────────────────────
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const PREFIX = "-";

// ─── Helper: Generate star string ───────────────────────────────────────────────
function generateStars(rating) {
    const filled = config.Stars.EMOJI_FILLED.repeat(rating);
    const empty = config.Stars.EMOJI_EMPTY.repeat(5 - rating);
    return filled + empty;
}

// ─── Helper: Build the rating container ─────────────────────────────────────────
function buildRatingContainer() {
    return new ContainerBuilder()
        .setAccentColor(parseInt(config.Embed.COLOR.replace("#", ""), 16))
        .addTextDisplayComponents((t) => t.setContent("**📝 RATE OUR PRODUCT**"))
        .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addSectionComponents((s) => 
            s.addTextDisplayComponents(
                (t) => t.setContent("We value your feedback!"),
                (t) => t.setContent("Click the button below to share your experience.")
            )
            .setButtonAccessory((b) => 
                b.setCustomId("open_review_modal")
                 .setLabel("Write Review")
                 .setStyle(ButtonStyle.Success)
            )
        );
}

// ─── Helper: Build the final review container ───────────────────────────────────
function buildReviewContainer(user, rating, description) {
    const stars = generateStars(rating);

    return new ContainerBuilder()
        .setAccentColor(parseInt(config.Embed.REVIEW_COLOR.replace("#", ""), 16))
        .addTextDisplayComponents((t) => t.setContent("**📋 NEW PRODUCT REVIEW**"))
        .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addSectionComponents((sec) => 
            sec.addTextDisplayComponents(
                (t) => t.setContent(`👤 **Reviewer:** ${user.username}`),
                (t) => t.setContent(`⭐ **Rating:** ${stars} (${rating}/5)`)
            )
            .setThumbnailAccessory((thumb) => 
                thumb.setURL(user.displayAvatarURL({ extension: 'png', size: 128 }))
            )
        )
        .addSeparatorComponents((sep) => sep.setDivider(false).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents((t) => t.setContent(`**📝 Description:**\n> ${description || "*No description provided*"}`))
        .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents((t) => t.setContent(`*Sent via ${config.Embed.FOOTER_TEXT}*`));
}

// ─── Bot Ready ──────────────────────────────────────────────────────────────────
client.once("ready", () => {
    console.log("╔══════════════════════════════════════╗");
    console.log(`║  🤖 Bot online: ${client.user.tag}`);
    console.log(`║  📡 Servers: ${client.guilds.cache.size}`);
    console.log("╠══════════════════════════════════════╣");
    console.log("║  ⭐ Ea-Rating System (V2)            ║");
    console.log(`║  📌 Prefix: ${PREFIX}                        ║`);
    console.log("╚══════════════════════════════════════╝");
});

// ─── Prefix Command Handler ─────────────────────────────────────────────────────
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // ── Command: -review ────────────────────────────────────────────────────
    if (command === "review") {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("❌ You need **Administrator** permission to use this command.");
        }

        const container = buildRatingContainer();

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });
        return;
    }

    // ── Command: -setup-review (Admin only) ─────────────────────────────────
    if (command === "setup-review") {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("❌ You need **Administrator** permission to use this command.");
        }

        const container = new ContainerBuilder()
            .setAccentColor(parseInt(config.Embed.COLOR.replace("#", ""), 16))
            .addTextDisplayComponents((t) => t.setContent("**⭐ PRODUCT FEEDBACK**"))
            .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addSectionComponents((s) => 
                s.addTextDisplayComponents(
                    (t) => t.setContent("Want to share your experience?"),
                    (t) => t.setContent("Your feedback helps us improve our services!")
                )
                .setButtonAccessory((b) => 
                    b.setCustomId("open_review_modal")
                     .setLabel("Write Review")
                     .setStyle(ButtonStyle.Success)
                )
            );

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });

        await message.reply("✅ Review has been started in this channel!");
        return;
    }
});

// ─── Interaction Handler (Button & Modal) ───────────────────────────────────────
client.on("interactionCreate", async (interaction) => {
    // ── Button: Open review modal ───────────────────────────────────────────
    if (interaction.isButton() && interaction.customId === "open_review_modal") {
        const modal = new ModalBuilder()
            .setCustomId("review_modal")
            .setTitle("📝 Leave a Review");

        const starsInput = new TextInputBuilder()
            .setCustomId("review_stars")
            .setLabel("Stars (1-5)")
            .setPlaceholder("Enter a number from 1 to 5")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(1);

        const descriptionInput = new TextInputBuilder()
            .setCustomId("review_description")
            .setLabel("Description")
            .setPlaceholder("Tell us about your experience...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(1000);

        modal.addComponents(
            new ActionRowBuilder().addComponents(starsInput),
            new ActionRowBuilder().addComponents(descriptionInput)
        );

        await interaction.showModal(modal);
        return;
    }

    // ── Modal Submit: Review ────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId === "review_modal") {
        const starsRaw = interaction.fields.getTextInputValue("review_stars");
        const rating = parseInt(starsRaw);

        // Validate rating
        if (isNaN(rating) || rating < 1 || rating > 5) {
            await interaction.reply({
                content: "❌ Invalid rating! Please enter a number from **1** to **5**.",
                ephemeral: true,
            });
            return;
        }

        const description =
            interaction.fields.getTextInputValue("review_description") || "";

        // Build the review container
        const reviewContainer = buildReviewContainer(
            interaction.user,
            rating,
            description
        );

        // Send to the review channel
        const reviewChannel = interaction.guild.channels.cache.get(
            config.Setting.REVIEW_CHANNEL_ID
        );

        if (!reviewChannel) {
            await interaction.reply({
                content: "❌ Review channel not found! Please contact an administrator.",
                ephemeral: true,
            });
            return;
        }

        await reviewChannel.send({ 
            components: [reviewContainer],
            flags: MessageFlags.IsComponentsV2
        });

        // Confirm to the user
        const confirmContainer = new ContainerBuilder()
            .setAccentColor(parseInt(config.Embed.REVIEW_COLOR.replace("#", ""), 16))
            .addTextDisplayComponents(
                (t) => t.setContent("**✅ Review Submitted!**"),
                (t) => t.setContent(
                    `Thank you for your review!\n\n` +
                    `**Rating:** ${generateStars(rating)} (${rating}/5)\n` +
                    `**Description:** ${description || "*No description*"}\n\n` +
                    `Your review has been posted in <#${config.Setting.REVIEW_CHANNEL_ID}>.`
                )
            );

        await interaction.reply({
            components: [confirmContainer],
            flags: MessageFlags.IsComponentsV2,
            ephemeral: true,
        });
        return;
    }
});

client.login(config.Setting.TOKEN);
