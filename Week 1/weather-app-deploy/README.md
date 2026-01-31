# Weather App - React

A beautiful weather application built with React Hooks that fetches real-time weather data from the OpenWeatherMap API.

## Features

- Real-time weather data for any city worldwide
- Current temperature and weather conditions
- Detailed weather info (feels like, humidity, wind speed, pressure)
- Weather emoji icons based on conditions
- Loading states and error handling
- Responsive design
- Smooth animations

## API Key Setup

This app uses the OpenWeatherMap API. The API key is already included in the code, but if you want to use your own:

1. Get a FREE API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Replace the `API_KEY` in `index.html` line 199:
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```

## Deploy to Netlify

### Option 1: Drag and Drop (Easiest!)
1. Visit [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `weather-app-deploy` folder into the drop zone
3. Your weather app will be live instantly!

### Option 2: GitHub Integration
1. Push this folder to GitHub:
   ```bash
   git add weather-app-deploy
   git commit -m "Add weather app"
   git push
   ```
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Choose your repository
5. Set the base directory to `weather-app-deploy`
6. Click "Deploy site"

### Option 3: Netlify CLI
```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to this folder
cd weather-app-deploy

# Deploy to production
netlify deploy --prod
```

## Local Development

Simply open `index.html` in your browser. No build process or npm install required!

## Technologies Used

- React 18
- React Hooks (useState)
- OpenWeatherMap API
- Fetch API for HTTP requests
- Babel Standalone (for JSX transformation)
- CSS3 with animations

## How to Use

1. Enter any city name in the search box
2. Click "Search" or press Enter
3. View current weather conditions including:
   - Temperature in Celsius
   - Weather description
   - Feels like temperature
   - Humidity percentage
   - Wind speed
   - Atmospheric pressure

## Security Note

⚠️ **Important**: The API key is included in the frontend code for demonstration purposes. For production applications, consider:
- Using environment variables
- Implementing a backend proxy to hide your API key
- Using Netlify Functions or serverless functions

However, OpenWeatherMap's free tier API key is safe to expose in client-side code as it has rate limiting built in.

## API Information

- **API Provider**: OpenWeatherMap
- **Free Tier**: 60 calls/minute, 1,000,000 calls/month
- **Data**: Current weather data
- **Units**: Metric (Celsius, km/h)
