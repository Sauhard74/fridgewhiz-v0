# 🔧 Troubleshooting Guide

## API Quota Exceeded (402 Error)

### What it means:
You've exceeded the Spoonacular API free tier limit of **150 requests per day**.

### Quick Solutions:

#### 1. **Wait for Reset** (Free)
- Your quota resets every 24 hours
- Check when your quota resets on the [Spoonacular Dashboard](https://spoonacular.com/food-api/console#Dashboard)

#### 2. **Get a New Free API Key** (Free)
If you need immediate access, you can:
- Sign up for a new Spoonacular account with a different email
- Get a new free API key (another 150 requests/day)
- Update your `.env.local` file with the new key

```bash
# In .env.local
SPOONACULAR_API_KEY=your_new_api_key_here
```

#### 3. **Upgrade to Paid Plan** (Recommended for Production)
Visit: https://spoonacular.com/food-api/pricing

Plans:
- **Mega Plan**: 1,500 points/month - $19/month
- **Ultra Plan**: 5,000 points/month - $49/month
- **Mega Ultra Plan**: 50,000 points/month - $149/month

#### 4. **Check Your Current Usage**
Go to: https://spoonacular.com/food-api/console#Dashboard
- See how many requests you've used
- Check when your quota resets
- Monitor your daily usage

### Development Tips to Save API Calls:

1. **Use Caching**: Store recipe results temporarily
2. **Test with Fewer Ingredients**: Use 2-3 ingredients during development
3. **Limit Searches**: Test search functionality sparingly
4. **Use Mock Data**: Create sample data for UI development

### Current API Key Info:
Your current key: `eb57d9b6056d4f29b6f984795828ac05`
- Check usage at: https://spoonacular.com/food-api/console#Dashboard

---

## Other Common Issues

### Image Upload Not Working
- Ensure OpenAI API key is set correctly
- Check image file format (JPG, PNG supported)
- Try a clearer image with better lighting

### Recipe Details Page Not Loading
- Check internet connection
- Verify Spoonacular API key is valid
- Check browser console for specific errors

### Deployment Issues
- Ensure all environment variables are set in Vercel dashboard
- Check that API keys are added to production environment
- Review Vercel deployment logs for errors

---

## Need Help?
- Open an issue on GitHub
- Check the main README.md for setup instructions
- Contact Spoonacular support for API-specific questions

