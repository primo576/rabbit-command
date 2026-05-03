

ALL_TEMPLATE.Config_white_TEMPLATE_CONFIG=[
  {
    label: '— 自訂 —',
    value: `如果有\${} 要加上跳脫符\\ 可以多行處理`,
    risk: 'custom',
    desc: ``
},
{   "label": "查看目前狀態",
    "value": "git status",
    "risk": "safe",
    "desc": "查看目前工作目錄與暫存區狀態，最常用的安全指令"
  }
  ]

ALL_TEMPLATE.CloudFlare_TEMPLATE_CONFIG=[
  {
    label: '— 自訂 —',
    value: '',
    risk: 'custom',
    desc: ``
},
{   "label": "301 302跳轉設定",
    "value": `*\${origin}/*
https://\${targetURL}/$2`,
    "risk": "safe",
    "desc": `轉接 URL
規則->網頁規則->建立規則
參考
*example.com/*
https://target-example.com/$2
301 - 永久重新導向`
  }
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

ALL_TEMPLATE.k8s_top_TEMPLATE_CONFIG = [
  {
    label: '— 自訂 —',
    value: '',
    risk: 'custom',
    desc: ``
  },

  {
    label: 'CPU 使用率過高',
    value: 'cpu_high',
    risk: 'high',
    desc: `
【判斷方式】
kubectl top pod -A
觀察 CPU 使用率持續偏高（接近或超過 limit）

kubectl top pod -A --sort-by=cpu
kubectl top pod -A --sort-by=memory

【可能原因】
- 應用程式死迴圈 / 高運算
- 流量暴增
- request / limit 設定過低

【處理方式】
1. 確認 Pod limit
   kubectl describe pod <pod>

2. 查看 node 狀況
   kubectl top node

3. 檢查 HPA
   kubectl get hpa

4. 臨時解法
   - 調高 limit
   - scale out
`
  },

  {
    label: 'Memory 使用率過高',
    value: 'memory_high',
    risk: 'high',
    desc: `
【判斷方式】
kubectl top pod -A
Memory 接近 limit 或持續上升

【可能原因】
- Memory leak
- cache 未釋放
- request/limit 設定不合理

【處理方式】
1. 檢查 OOM
   kubectl describe pod <pod> | grep -i oom

2. 查看 restart 次數
   kubectl get pod

3. 臨時解法
   - 調高 memory limit
   - 重啟 pod

4. 長期解法
   - 修程式 memory leak
`
  },

  {
    label: '單一 Pod 資源異常',
    value: 'single_pod_abnormal',
    risk: 'medium',
    desc: `
【判斷方式】
kubectl top pod -A | sort -k3 -nr

【可能原因】
- 熱點流量集中
- pod 負載不均

【處理方式】
- 檢查 service 是否有正確 load balance
- 檢查 readinessProbe
- 重啟異常 pod
`
  },

  {
    label: 'Node 資源過高',
    value: 'node_high',
    risk: 'critical',
    desc: `
【判斷方式】
kubectl top node

【可能原因】
- pod 過度集中
- node 規格不足
- daemonset 吃資源

【處理方式】
1. 查看 pod 分佈
   kubectl get pod -o wide

2. 驗證是否集中在單一 node

3. 解法
   - cordon + drain
   - 調整 affinity
   - 擴 node
`
  },

  {
    label: 'Pod OOMKilled',
    value: 'oom_killed',
    risk: 'critical',
    desc: `
【判斷方式】
kubectl get pod
STATUS = OOMKilled / CrashLoopBackOff

【可能原因】
- memory limit 太低
- memory leak

【處理方式】
1. 查看 log
   kubectl logs <pod>

2. describe
   kubectl describe pod <pod>

3. 解法
   - 調高 memory limit
   - 修程式
`
  },

  {
    label: '沒有 metrics（kubectl top 無資料）',
    value: 'no_metrics',
    risk: 'medium',
    desc: `
【判斷方式】
kubectl top pod 出現 error

【可能原因】
- metrics-server 未安裝
- RBAC 問題

【處理方式】
kubectl get apiservice | grep metrics

確認 metrics-server 是否正常

必要時重新部署 metrics-server
`
  }
]