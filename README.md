# 🍽️ FridgeWhiz - Recipe Recommender

Find delicious recipes based on what's in your fridge! FridgeWhiz helps you reduce food waste and discover creative meals using your leftover ingredients.

![FridgeWhiz](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔍 **Smart Recipe Search**: Find recipes based on ingredients you have
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 🔥 **Calorie Filter**: Set maximum calories per serving
- 💰 **Budget Filter**: Filter by price per serving
- 🤖 **AI-Powered Fun Names**: Get creative recipe names like "Crisis Curry" or "End-of-Month Pasta" (optional)
- ❤️ **Recipe Ratings**: See popular recipes with like counts
- 📱 **Mobile-Friendly**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A [Spoonacular API key](https://spoonacular.com/food-api/console#Dashboard) (free tier available)
- (Optional) An [OpenAI API key](https://platform.openai.com/api-keys) for fun recipe names

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd project
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Required: Get your free API key from https://spoonacular.com/food-api/console#Dashboard
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# Optional: For creative recipe names - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Add Ingredients**: Type in what ingredients you have in your fridge and click "Add"
2. **Set Filters** (Optional):
   - Max Calories: Set maximum calories per serving
   - Max Price: Set maximum price per serving in dollars
3. **Find Recipes**: Click the "Find Recipes" button
4. **Explore**: Browse through the recipe suggestions and click "View Recipe" for full details

## 📁 Project Structure

```
project/
├── app/
│   ├── api/
│   │   └── recipes/
│   │       └── route.ts          # API endpoint for recipe search
│   ├── components/
│   │   └── RecipeCard.tsx        # Recipe display component
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── .gitignore
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**: 
  - Spoonacular (Recipe data)
  - OpenAI (Optional - AI-generated fun names)
- **UI Icons**: Lucide React
- **HTTP Client**: Axios

## 🌐 Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables**

In the Vercel dashboard, go to your project → Settings → Environment Variables and add:
- `SPOONACULAR_API_KEY`
- `OPENAI_API_KEY` (optional)

### Option 2: Deploy via GitHub

1. **Push to GitHub**
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in the setup
   - Click "Deploy"

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

Remember to add your API keys in the Vercel project settings after deployment!

## 🔑 Getting API Keys

### Spoonacular (Required)

1. Visit [https://spoonacular.com/food-api/console#Dashboard](https://spoonacular.com/food-api/console#Dashboard)
2. Sign up for a free account
3. Get your API key (150 requests/day on free tier)
4. Add to `.env.local` as `SPOONACULAR_API_KEY`

### OpenAI (Optional)

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up and create an API key
3. Add to `.env.local` as `OPENAI_API_KEY`
4. Note: This adds fun, creative names to recipes but is not required for core functionality

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SPOONACULAR_API_KEY` | ✅ Yes | API key from Spoonacular for recipe data |
| `OPENAI_API_KEY` | ⭕ Optional | API key from OpenAI for creative recipe names |

## 🎨 Features in Detail

### Recipe Search
The app uses Spoonacular's "Find by Ingredients" endpoint to search for recipes that maximize the use of your available ingredients while minimizing missing ones.

### Calorie Filtering
When you set a max calorie limit, the app fetches detailed nutrition information for each recipe and filters out those exceeding your limit.

### Price Filtering
Filter recipes by cost per serving to stay within your budget.

### AI Fun Names
If OpenAI is configured, recipes get creative, humorous names like:
- "Crisis Curry" 
- "End-of-Month Pasta"
- "Fridge Cleanout Special"
- "Whatever's Left Stir-Fry"

## 🧪 Development

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Spoonacular API](https://spoonacular.com/food-api) for recipe data
- [OpenAI](https://openai.com/) for AI-powered features
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 🐛 Troubleshooting

### "Invalid API key" error
- Check that your `SPOONACULAR_API_KEY` is correctly set in `.env.local`
- Make sure to restart the dev server after adding environment variables

### "API quota exceeded" error
- The free Spoonacular tier has 150 requests/day
- Consider upgrading to a paid plan for more requests

### No fun recipe names appearing
- This is expected if `OPENAI_API_KEY` is not set (it's optional)
- Add the OpenAI API key to enable this feature

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Happy Cooking! 👨‍🍳👩‍🍳**

