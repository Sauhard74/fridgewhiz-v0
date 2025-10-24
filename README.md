# 🍽️ FridgeWhiz - Recipe Recommender

Find delicious recipes based on what's in your fridge! FridgeWhiz helps you reduce food waste and discover creative meals using your leftover ingredients.

![FridgeWhiz](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 📸 **AI Image Recognition**: Upload photos of your fridge and automatically detect ingredients using GPT-4 Vision
- 🖱️ **Drag & Drop Upload**: Easy image upload with drag-and-drop support
- 🔍 **Smart Recipe Search**: Find recipes based on ingredients you have
- 📖 **Detailed Recipe Pages**: View complete recipes with ingredients, instructions, and nutrition on your site
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 🔥 **Calorie Filter**: Set maximum calories per serving
- 💰 **Budget Filter**: Filter by price per serving
- 🤖 **AI-Powered Fun Names**: Get creative recipe names like "Crisis Curry" or "End-of-Month Pasta"
- ❤️ **Recipe Ratings**: See popular recipes with like counts
- 🏷️ **Recipe Tags**: Vegan, vegetarian, gluten-free, dairy-free indicators
- 📱 **Mobile-Friendly**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A [Spoonacular API key](https://spoonacular.com/food-api/console#Dashboard) (free tier available)
- An [OpenAI API key](https://platform.openai.com/api-keys) for image recognition and fun recipe names

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

# Required: For AI image recognition and creative recipe names - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Upload a Photo** (AI-Powered):
   - Click the upload area or drag & drop an image of your fridge
   - AI will automatically detect ingredients in seconds
   - Watch as ingredients are added to your list automatically

2. **Or Add Manually**: Type in what ingredients you have and click "Add"

3. **Set Filters** (Optional):
   - Max Calories: Set maximum calories per serving
   - Max Price: Set maximum price per serving in dollars

4. **Find Recipes**: Click the "Find Recipes" button

5. **View Details**: Click on any recipe to see full details including:
   - Complete ingredient list
   - Step-by-step cooking instructions
   - Nutrition information
   - Dietary tags (vegan, vegetarian, etc.)
   - Cooking time and servings

## 📁 Project Structure

```
project/
├── app/
│   ├── api/
│   │   ├── analyze-image/
│   │   │   └── route.ts          # AI image analysis endpoint
│   │   ├── recipe/
│   │   │   └── [id]/
│   │   │       └── route.ts      # API for single recipe details
│   │   └── recipes/
│   │       └── route.ts          # API endpoint for recipe search
│   ├── components/
│   │   ├── ImageUpload.tsx       # Image upload with AI detection
│   │   └── RecipeCard.tsx        # Recipe display component
│   ├── recipe/
│   │   └── [id]/
│   │       └── page.tsx          # Recipe details page
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
  - OpenAI GPT-4o-mini (AI image recognition & fun names)
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

### OpenAI

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up and create an API key
3. Add to `.env.local` as `OPENAI_API_KEY`
4. Note: This is required for image recognition and fun recipe names

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SPOONACULAR_API_KEY` | ✅ Yes | API key from Spoonacular for recipe data |
| `OPENAI_API_KEY` | ✅ Yes | API key from OpenAI for image recognition and creative names |

## 🎨 Features in Detail

### AI Image Recognition
Upload a photo of your fridge, and GPT-4 Vision will automatically analyze it and detect all visible ingredients. The AI can identify:
- Fresh produce (vegetables, fruits)
- Meats and proteins
- Dairy products
- Pantry items
- Condiments and more

### Recipe Search
The app uses Spoonacular's "Find by Ingredients" endpoint to search for recipes that maximize the use of your available ingredients while minimizing missing ones.

### Calorie Filtering
When you set a max calorie limit, the app fetches detailed nutrition information for each recipe and filters out those exceeding your limit.

### Price Filtering
Filter recipes by cost per serving to stay within your budget.

### AI Fun Names
Recipes get creative, humorous names generated by AI like:
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
- Check that your `SPOONACULAR_API_KEY` and `OPENAI_API_KEY` are correctly set in `.env.local`
- Make sure to restart the dev server after adding environment variables

### "API quota exceeded" error
- The free Spoonacular tier has 150 requests/day
- Consider upgrading to a paid plan for more requests

### No fun recipe names appearing
- Check that your `OPENAI_API_KEY` is correctly set
- The OpenAI API key is required for both image recognition and fun names

### Image upload not working
- Ensure your OpenAI API key is configured
- Check that the image file is a valid format (JPG, PNG, etc.)
- Try a clearer image with better lighting

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Happy Cooking! 👨‍🍳👩‍🍳**

