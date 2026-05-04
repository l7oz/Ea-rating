# ⭐ Ea-Rating Bot (Components V2)

A modern, high-end Discord review bot built with **discord.js v14** and the new **Components v2 (Layout Components)** system. This bot provides a seamless and visually stunning experience for collecting and displaying product reviews.

## 🚀 Features

- **Modern Layout**: Uses the latest Discord layout components (`Container`, `Section`, `Separator`) for a premium look.
- **One-Button Modal**: Users can submit a review (stars + description) through a single, clean Discord modal.
- **Visual Excellence**: Review posts include the user's avatar, star emojis, and formatted blockquotes.
- **Prefix Commands**: Simple `-` prefix for easy management.
- **Admin Control**: Secure setup commands restricted to server administrators.

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/l7oz/Ea-reating.git
   cd Ea-reating
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the bot**:
   Edit `config.js` and fill in your details:
   ```javascript
   module.exports = {
       Setting: {
           TOKEN: "YOUR_BOT_TOKEN",
           Client_ID: "YOUR_BOT_ID",
           GUILD_ID: "YOUR_SERVER_ID",
           REVIEW_CHANNEL_ID: "CHANNEL_ID_FOR_POSTS",
       },
       // ... other aesthetic settings
   };
   ```

4. **Start the bot**:
   ```bash
   node index.js
   ```

## 📜 Commands

| Command | Permission | Description |
| --- | --- | --- |
| `-review` | Administrator | Sends the rating panel in the current channel. |
| `-setup-review` | Administrator | Posts a persistent review panel for users to interact with. |

## 🎨 Layout Preview

The bot utilizes the modern **Components v2** system, meaning:
- **Containers**: Grouped content with accent colors.
- **Sections**: Side-by-side text and accessories (Buttons or User Avatars).
- **Separators**: Clean horizontal lines for visual hierarchy.

## 👤 Credits

Developed by **Eagle | .l7o**.

## 📝 ملاحظة (Note)

هذا المشروع مفتوح المصدر ويحق لك التعديل عليه بما لا يخالف قوانين الديسكورد الرسمية.
(This project is open-source, and you have the right to modify it in a way that does not violate official Discord rules.)

## 📄 License

This project is licensed under the MIT License.
