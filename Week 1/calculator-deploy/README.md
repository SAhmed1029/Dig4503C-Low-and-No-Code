# Calculator App - React

A fully functional calculator built with React Hooks.

## Features

- Basic operations: Addition, Subtraction, Multiplication, Division
- Decimal support
- Percentage calculations
- Toggle sign (+/-)
- Chain calculations
- Clear function (AC)
- Visual feedback showing previous operations
- Responsive design

## Deploy to Netlify

### Option 1: Drag and Drop (Easiest!)
1. Visit [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `calculator-deploy` folder into the drop zone
3. Your calculator will be live instantly!

### Option 2: GitHub Integration
1. Push this folder to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Choose your repository
5. Set the base directory to `calculator-deploy`
6. Click "Deploy site"

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to this folder
cd calculator-deploy

# Deploy
netlify deploy --prod
```

## Local Development

Simply open `index.html` in your browser. No build process required!

## Technologies Used

- React 18
- React Hooks (useState)
- Babel Standalone (for JSX transformation)
- CSS Grid Layout

## How to Use

1. Click number buttons to enter values
2. Click operation buttons (+, -, ×, ÷) to perform calculations
3. Click = to see the result
4. Click AC to clear everything
5. Click +/- to toggle between positive and negative
6. Click % to convert to percentage
7. Click . to add decimal points
