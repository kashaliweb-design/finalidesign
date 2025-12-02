"use client";

import { useEffect, useState } from "react";

export default function TestCookiesPage() {
  const [cookies, setCookies] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);

  useEffect(() => {
    // Get all cookies visible to JavaScript
    setCookies(document.cookie || "No cookies found");
  }, []);

  const testVerifyEndpoint = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        credentials: "include",
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: "Failed to verify" });
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>Cookie Test Page</h1>
      
      <div style={{ marginTop: "20px", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>JavaScript Accessible Cookies:</h2>
        <pre style={{ background: "#fff", padding: "15px", borderRadius: "4px", overflow: "auto" }}>
          {cookies}
        </pre>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          Note: HTTP-only cookies (like auth tokens) won't appear here - they're only accessible by the server
        </p>
      </div>

      <div style={{ marginTop: "20px", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Test Auth Verification:</h2>
        <button 
          onClick={testVerifyEndpoint}
          style={{
            padding: "10px 20px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Test /api/auth/verify
        </button>
        
        {apiResponse && (
          <pre style={{ background: "#fff", padding: "15px", borderRadius: "4px", marginTop: "15px", overflow: "auto" }}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: "20px", padding: "20px", background: "#fff3cd", borderRadius: "8px" }}>
        <h3>How to Check HTTP-only Cookies:</h3>
        <ol style={{ lineHeight: "1.8" }}>
          <li>Open Browser DevTools (F12)</li>
          <li>Go to <strong>Application</strong> tab (Chrome) or <strong>Storage</strong> tab (Firefox)</li>
          <li>Click on <strong>Cookies</strong> in the left sidebar</li>
          <li>Select your domain (localhost:3000)</li>
          <li>Look for a cookie named <strong>"token"</strong> with HttpOnly = ✓</li>
        </ol>
      </div>

      <div style={{ marginTop: "20px" }}>
        <a href="/auth" style={{ color: "#0070f3", textDecoration: "underline" }}>
          Go to Login Page
        </a>
      </div>
    </div>
  );
}
