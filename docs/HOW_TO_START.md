# How to Start the Web Server

This guide provides step-by-step instructions for starting the JJ Thai Spa web application locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher recommended)
- **npm** (comes with Node.js)

You can verify your installations by running:
```bash
node --version
npm --version
```

## Project Overview

This is a React-based spa website built with:
- **React 19.2.0** - UI framework
- **Vite 6.2.0** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework (configured in index.html)

The application includes:
- Header with navigation
- Hero section
- Promotional carousel
- Services showcase
- Customer reviews section
- Image gallery
- Call-to-action section
- Footer
- Cookie consent banner

## Setup Instructions

### Step 1: Install Dependencies

Navigate to the project directory and install all required dependencies:

```bash
cd /home/miker/jjthaispa2
npm install
```

This will install:
- React and React DOM
- Vite and the React plugin
- TypeScript and type definitions
- All other dependencies listed in `package.json`

### Step 2: Configure Environment Variables (Optional)

The project includes a `.env.local` file for environment configuration. If you need to use the Gemini API:

1. Open `.env.local` in a text editor
2. Set your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

> **Note:** The `.env.local` file is gitignored for security purposes.

### Step 3: Start the Development Server

Run the development server using:

```bash
npm run dev
```

This command:
- Starts the Vite development server
- Enables hot module replacement (HMR) for instant updates
- Serves the application on port **3000**
- Makes the server accessible on all network interfaces (0.0.0.0)

### Step 4: Access the Application

Once the server starts, you can access the application at:

- **Local:** http://localhost:3000
- **Network:** http://[your-ip-address]:3000

The terminal will display the exact URLs where the application is running.

## Available Scripts

The project includes the following npm scripts:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the production-ready application |
| `npm run preview` | Preview the production build locally |

## Development Server Configuration

The Vite development server is configured with the following settings (in `vite.config.ts`):

- **Port:** 3000
- **Host:** 0.0.0.0 (accessible from network)
- **Hot Module Replacement:** Enabled by default
- **Path Alias:** `@` points to the project root directory

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can either:

1. Stop the process using port 3000
2. Modify the port in `vite.config.ts`:
   ```typescript
   server: {
     port: 3001, // Change to your preferred port
     host: '0.0.0.0',
   }
   ```

### Dependencies Not Installing

If you encounter issues during `npm install`:

1. Clear the npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

### Module Not Found Errors

If you see module not found errors:

1. Ensure all dependencies are installed: `npm install`
2. Check that TypeScript configuration is correct in `tsconfig.json`
3. Restart the development server

## Project Structure

```
jjthaispa2/
├── components/          # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── ReviewsSection.tsx
│   ├── Gallery.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   ├── CookieBanner.tsx
│   └── PromoCarousel.tsx
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── constants.ts        # Application constants
├── types.ts            # TypeScript type definitions
├── package.json        # Project dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── .env.local          # Environment variables (gitignored)
```

## Next Steps

After starting the server:

1. The application will automatically reload when you make changes to the code
2. Edit components in the `components/` directory to customize the website
3. Modify styles in `index.html` (Tailwind CSS classes)
4. Update constants in `constants.ts` for business information
5. Build for production using `npm run build` when ready to deploy

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
