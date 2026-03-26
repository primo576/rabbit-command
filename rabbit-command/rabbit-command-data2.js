

ALL_TEMPLATE.Config_white_TEMPLATE_CONFIG=[
  {
    label: '— 自訂 —',
    value: '',
    risk: 'custom',
    desc: ``
},
{   "label": "查看目前狀態",
    "value": "git status",
    "risk": "safe",
    "desc": "查看目前工作目錄與暫存區狀態，最常用的安全指令"}
  ]


  
  ALL_TEMPLATE.linux_install_TEMPLATE_CONFIG = [
  {
    label: 'install promtail',
    value: 'curl http://loki-gateway/loki/api/v1/push',
    risk: 'safe',
     desc: `
wget https://github.com/grafana/loki/releases/latest/download/promtail-linux-amd64.zip
unzip promtail-linux-amd64.zip
apt install unzip
unzip promtail-linux-amd64.zip
sudo mv promtail-linux-amd64 /usr/local/bin/promtail
vim /etc/promtail-config.yaml
promtail -config.file=/etc/promtail-config.yaml
curl localhost:9080/metrics | grep promtail_sent
要去找promtail-config.yaml 模板

test net port

curl -X POST http://loki.test-yq.top/loki/api/v1/push \
  -H "Content-Type: application/json" \
  -d '{
    "streams": [
      {
        "stream": {
          "job": "test-log-e1"
        },
        "values": [
          ["'$(date +%s%N)'", "hello loki post test"]
        ]
      }
    ]
  }'
`
  },  
 {
    label: '— 自訂 —',
    value: '',
    risk: 'custom',
    desc: ``
  }
]