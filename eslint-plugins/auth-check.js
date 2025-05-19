/**
 * Custom ESLint rule to enforce authentication checks in protected routes
 */
const fs = require("fs")
const path = require("path")

// Define default whitelisted paths as fallback
const DEFAULT_WHITELIST = ["app/api/health/route.ts", "app/page.tsx", "app/layout.tsx"]

// Read the whitelist from the external file
let whitelistedPaths = DEFAULT_WHITELIST

// Get absolute path to whitelist file
const whitelistPath = path.resolve(__dirname, "../security-whitelist.txt")

// Try to load the whitelist, fall back to defaults if anything fails
try {
  if (fs.existsSync(whitelistPath)) {
    const whitelistContents = fs.readFileSync(whitelistPath, "utf8")
    const paths = whitelistContents
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")) // Allow for comments

    if (paths.length > 0) {
      whitelistedPaths = paths
    }
  }
} catch (error) {
  // Silent fallback to DEFAULT_WHITELIST
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Ensure protected routes have proper authentication checks",
      category: "Security",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingAuth: "This file appears to be a protected route but lacks proper authentication checks.",
    },
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename()

        // Only check files in the app directory, not in components
        if (!filename.includes("/app/") && !filename.includes("\\app\\")) {
          return
        }

        // Skip checking if it's in the whitelist
        const isWhitelisted = whitelistedPaths.some(
          (wl) => filename.includes(wl) || filename.includes(wl.replace("/", "\\"))
        )
        if (isWhitelisted) {
          return
        }

        const sourceCode = context.getSourceCode().getText()
        const hasServerSession = sourceCode.includes("getServerSession")
        const hasClientSession = sourceCode.includes("useSession")
        const hasAccessDenied = sourceCode.includes("AccessDenied")

        if ((!hasServerSession && !hasClientSession) || !hasAccessDenied) {
          context.report({
            node,
            messageId: "missingAuth",
          })
        }
      },
    }
  },
}
