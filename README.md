# Let's Try Monitoring

This repo contains a dockerized web api (node.js) and a prometheus + grafana setup. The web api exposes some default metrics to prometheus, and one custom metric (http response time).

## Setup

To run, you need docker and docker compose installed locally, then execute the following:

```sh
# Start
docker compose up --build
```

Node.js app runs locally on `localhost:8011`. You can check `/metrics` and `/metrics-list` endpoints.

Prometheus runs locally on `localhost:8061`. Try running a query, like:

```promql
# Calculate the average request duration during the last 5 minutes
rate(http_request_duration_seconds_sum[5m])
  /
  rate(http_request_duration_seconds_count[5m])
```

Grafana runs locally on `localhost:9011`. (You don't need to look at this, I only put it here to debug an issue I thought I was having while collecting metrics from the node.js app.)

### TODO

- [ ] Configure some alert logic
- [ ] Run script to trigger alert (?)
- [ ] Connect to FP
- [ ] Profit
- [ ] Investigate a node-exporter wrapper to monitor system events (on macos for example)

## Learning Materials

If you're new to prometheus, start here:

- [Introduction to Prometheus concepts](https://www.youtube.com/watch?v=h4Sl21AKiDg&ab_channel=TechWorldwithNana) (video)

- [Prometheus Getting Started documentation](https://prometheus.io/docs/prometheus/latest/getting_started/)

- [Default metrics suggested by prometheus](https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors)
