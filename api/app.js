/**
 * A dead-simple express.js application that also exposes an endpoint for monitoring
 */

import express from "express";
import prometheusClient from "prom-client";

const PORT = 5000;
const HOST = "0.0.0.0";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

// Monitoring
// const collectDefaultMetrics = prometheusClient.collectDefaultMetrics;
// const Registry = prometheusClient.Registry;
// const register = new Registry();
prometheusClient.collectDefaultMetrics();

// Create a custom histogram metric
const httpRequestTimer = new prometheusClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});

// Register the histogram
prometheusClient.register.registerMetric(httpRequestTimer);

/**
 * The endpoint prometheus scrapes
 */
app.get("/metrics", async (req, res) => {
  // Start the HTTP request timer, saving a reference to the returned method
  const end = httpRequestTimer.startTimer();
  // Save reference to the path so we can record it when ending the timer
  const route = req.route.path;

  res.status(200).set("Content-Type", prometheusClient.register.contentType);
  const metrics = await prometheusClient.register.metrics();
  console.log("Scraping!", metrics.slice(0, 25).replace(/\n/g, "\\n"), "...");
  res.end(metrics);

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

/**
 * List the metrics we're collecting
 * Visit this endpoint to inspect what prometheus will scare
 */
app.get("/metrics-list", (req, res) => {
  res.send(prometheusClient.collectDefaultMetrics.metricsList);
});
