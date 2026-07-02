

ALL_TEMPLATE.Config_white_TEMPLATE_CONFIG=[
  {
    label: '— 自訂 —',
    value: `如果有\${} 要加上跳脫符\\ 可以多行處理`,
    risk: null,
    desc: ``
},
{   "label": "查看目前狀態",
    "value": `\${example}`,
    "risk": "safe",
    "desc": `查看目前工作目錄與暫存區狀態，最常用的安全指令`
  }
  ]


  


ALL_TEMPLATE.NEWwebCreate_TEMPLATE_CONFIG=[
 {
    label: '================== a-z 建站參考模板======================',
    value: '',
    risk: null,
    desc: ``
  },

  {
    label: 'Step1: ns a-z表用',
    value: `\${ns}a
\${ns}b
\${ns}c
\${ns}d
\${ns}e
\${ns}f
\${ns}g
\${ns}h
\${ns}i
\${ns}j
\${ns}k
\${ns}l
\${ns}m
\${ns}n
\${ns}o
\${ns}p
\${ns}q
\${ns}r
\${ns}s
\${ns}t
\${ns}u
\${ns}v
\${ns}w
\${ns}x
\${ns}y
\${ns}z`,
    risk: 'safe',
    desc: `表用正序abc`
  },
  {
    label: 'Step2: ns a-z建站腳本用',
    value: `\${ns}a,\${ns}b,\${ns}c,\${ns}d,\${ns}e,\${ns}f,\${ns}g,\${ns}h,\${ns}i,\${ns}j,\${ns}k,\${ns}l,\${ns}m,\${ns}n,\${ns}o,\${ns}p,\${ns}q,\${ns}r,\${ns}s,\${ns}t,\${ns}u,\${ns}v,\${ns}w,\${ns}x,\${ns}y,\${ns}z`,
    
    risk: 'safe',
    desc: `建站腳本用 要記得刪除最後的,`
  },
  /*
  {
    label: '(略)升級腳本用 ns轉array',
    value: '"${ns}",',
    risk: 'safe',
    desc: ` 產出後貼到網址會一排`
    //value: `"\${ns}a ","\${ns}b ","\${ns}c ","\${ns}d ","\${ns}e ","\${ns}f ","\${ns}g ","\${ns}h ","\${ns}i ","\${ns}j ","\${ns}k ","\${ns}l ","\${ns}m ","\${ns}n ","\${ns}o ","\${ns}p ","\${ns}q ","\${ns}r ","\${ns}s ","\${ns}t ","\${ns}u ","\${ns}v ","\${ns}w ","\${ns}x ","\${ns}y ","\${ns}z"`,
    
  },*/
  {
    label: 'Step3: ns z-a升級腳本用',
    value: `"\${ns}z","\${ns}y","\${ns}x","\${ns}w","\${ns}v","\${ns}u","\${ns}t","\${ns}s","\${ns}r","\${ns}q","\${ns}p","\${ns}o","\${ns}n","\${ns}m","\${ns}l","\${ns}k","\${ns}j","\${ns}i","\${ns}h","\${ns}g","\${ns}f","\${ns}e","\${ns}d","\${ns}c","\${ns}b","\${ns}a",`,
    risk: 'safe',
    desc: `要注意是否需要,號
    abc -> cba
升級腳本用的順序是倒序 最新的在最上面 和表順序相反`
  }, {
    label: 'Step4: 測試gocro路由（✅安全）',
    value: `date
echo \${ns}
echo https://br-gocro.yq-ops.top/\${ns}/#/task
echo
curl https://br-gocro.yq-ops.top/\${ns}/#/task
echo
echo`,
    risk: 'safe',
    desc: `改完gocron後訪問新增的未啟動會是503
啟動的會是任務後台
例：
ph get ingress gocron -n gocron -o yaml
br get ingress gocron.com -n gocron -o yaml`
  },
  {
    label: '================== 0-9 建站參考模板======================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: 'Step1: ns0-9表用',
    value: `\${ns}0
\${ns}1
\${ns}2
\${ns}3
\${ns}4
\${ns}5
\${ns}6
\${ns}7
\${ns}8
\${ns}9`,
    risk: 'safe',
    desc: `表用正序abc`
  },  {
    label: 'Step2: ns0-9建站腳本用',
    value: `\${ns}0,\${ns}1,\${ns}2,\${ns}3,\${ns}4,\${ns}5,\${ns}6,\${ns}7,\${ns}8,\${ns}9,`,
    risk: 'safe',
    desc: `建站腳本用 要記得刪除最後的,`
  },{
    label: 'Step3: ns9-0升級腳本用',
    value: `"\${nsre}9","\${nsre}8","\${nsre}7","\${nsre}6","\${nsre}5","\${nsre}4","\${nsre}3","\${nsre}2","\${nsre}1","\${nsre}0",`,
    risk: 'safe',
    desc: `abc -> cba
升級腳本用的順序是倒序 最新的在最上面 和表順序相反`
  }, {
    label: 'Step4: Ingress backend 區塊（gocron 範例）',
    risk: 'safe',
    value: `      - backend:
          service:
            name: gocron-\${ns}
            port:
              number: 80
        path: /\${ns}(/|$)(.*)
        pathType: ImplementationSpecific`,
    desc: `br edit ingress gocron.com -n gocron 
ph edit ingress gocron -n gocron 
Ingress rules 片段
請確認 namespace / service 存在
保存在推流程
kubectl get ingress gocron.com -n gocron -o yaml > ingress.yaml
vim ingress.yaml
kubectl diff -f ingress.yaml
kubectl apply -f ingress.yaml
如果要看log
kubectl logs -n ingress-nginx deploy/ingress-nginx-controller | tail -n 50
即時追
kubectl logs -f deploy/ingress-nginx-controller -n ingress-nginx
`
  },
  {
    label: 'Step5: 測試gocron路由（✅安全）',
    value: `date
echo \${ns}
echo https://br-gocron.yq-ops.top/\${ns}/#/task
echo
curl https://br-gocron.yq-ops.top/\${ns}/#/task
echo
echo`,
    risk: 'safe',
    desc: `改完gocron後訪問新增的未啟動會是503
啟動的會是任務後台
例：
ph get ingress gocron -n gocron -o yaml
br get ingress gocron.com -n gocron -o yaml`
  }, 
]

ALL_TEMPLATE.CloudFlare_TEMPLATE_CONFIG=[
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
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
    risk: null,
    desc: ``
  }
]

ALL_TEMPLATE.k8s_top_TEMPLATE_CONFIG = [
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
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


ALL_TEMPLATE.AWS_s3_TEMPLATE_CONFIG = [
{
  label: 'S3 ls (Buckets)',
  value: 'aws --profile ${profileName} s3 ls',
  risk: 'safe',
  desc: '列出此 Profile 可存取的所有 S3 Bucket'
},
{
  label: 'S3 ls Bucket',
  value: 'aws --profile ${profileName} s3 ls s3://${bucket-name}',
  risk: 'safe',
  desc: '列出 Bucket 根目錄內容'
},
{
  label: 'S3 ls Recursive',
  value: 'aws --profile ${profileName} s3 ls s3://${bucket-name} --recursive',
  risk: 'safe',
  desc: '遞迴列出 Bucket 所有物件'
},
{
  label: 'S3 du',
  value: 'aws --profile ${profileName} s3 ls s3://${bucket-name} --recursive --human-readable --summarize',
  risk: 'safe',
  desc: '查看 Bucket 檔案數量與總容量'
},
{
  label: 'S3 cp Download',
  value: 'aws --profile ${profileName} s3 cp s3://${bucket-name}/file.txt ./',
  risk: 'read',
  desc: '下載單一檔案'
},
{
  label: 'S3 cp Upload',
  value: 'aws --profile ${profileName} s3 cp ./file.txt s3://${bucket-name}/',
  risk: 'write',
  desc: '上傳單一檔案'
},
{
  label: 'S3 cp Recursive Download',
  value: 'aws --profile ${profileName} s3 cp s3://${bucket-name} ./local --recursive',
  risk: 'read',
  desc: '下載整個資料夾'
},
{
  label: 'S3 cp Recursive Upload',
  value: 'aws --profile ${profileName} s3 cp ./local s3://${bucket-name} --recursive',
  risk: 'write',
  desc: '上傳整個資料夾'
},
{
  label: 'S3 sync Download',
  value: 'aws --profile ${profileName} s3 sync s3://${bucket-name} ./local',
  risk: 'read',
  desc: '同步 Bucket 到本機'
},
{
  label: 'S3 sync Upload',
  value: 'aws --profile ${profileName} s3 sync ./local s3://${bucket-name}',
  risk: 'write',
  desc: '同步本機到 Bucket'
},
{
  label: 'S3 sync DryRun',
  value: 'aws --profile ${profileName} s3 sync ./local s3://${bucket-name} --dryrun',
  risk: 'safe',
  desc: '預覽同步結果，不會真正執行'
},
{
  label: 'S3 sync Delete',
  value: 'aws --profile ${profileName} s3 sync ./local s3://${bucket-name} --delete',
  risk: 'danger',
  desc: '同步並刪除 Bucket 中不存在於本機的檔案'
},
{
  label: 'S3 rm File',
  value: 'aws --profile ${profileName} s3 rm s3://${bucket-name}/file.txt',
  risk: 'danger',
  desc: '刪除單一檔案'
},
{
  label: 'S3 rm Recursive',
  value: 'aws --profile ${profileName} s3 rm s3://${bucket-name}/path/ --recursive',
  risk: 'danger',
  desc: '遞迴刪除資料夾'
},
{
  label: 'S3 mb',
  value: 'aws --profile ${profileName} s3 mb s3://${bucket-name}',
  risk: 'write',
  desc: '建立新的 Bucket'
},
{
  label: 'S3 rb',
  value: 'aws --profile ${profileName} s3 rb s3://${bucket-name}',
  risk: 'danger',
  desc: '刪除空 Bucket'
},
{
  label: 'S3 rb Force',
  value: 'aws --profile ${profileName} s3 rb s3://${bucket-name} --force',
  risk: 'danger',
  desc: '刪除 Bucket（包含所有物件）'
}
]


ALL_TEMPLATE.Docker_TEMPLATE_CONFIG=[
  {   "label": "刪除 build layer cache",
    "value": `docker builder prune -a`,
    "risk": "safe",
    "desc": `先看docker佔用空間再看要怎麼刪除
  docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          5         1         4.271GB   3.339GB (78%)
Containers      1         0         214B      214B (100%)
Local Volumes   0         0         0B        0B
Build Cache     2600      0         258.6GB   258.6GB

這代表：
 Build Cache
  * 有 **2600 個 build layer cache**
  * 全部都是 **沒在用（ACTIVE = 0）**
  * **100% 可以刪**
`
  }
  ,
  {
  label: '──── Docker 啟動 ────',
  value: '',
  risk: null,
  desc: ``
},
{
  label: 'docker version',
  value: 'docker version',
  risk: 'safe',
  desc: '查看 Docker Client 與 Server 版本'
},
{
  label: 'docker info',
  value: 'docker info',
  risk: 'safe',
  desc: '查看 Docker 系統資訊'
},
{
  label: 'docker context ls',
  value: 'docker context ls',
  risk: 'safe',
  desc: '查看目前 Docker Context'
},
{
  label: 'docker login',
  value: 'docker login',
  risk: 'write',
  desc: '登入 Docker Registry'
},
{
  label: 'docker logout',
  value: 'docker logout',
  risk: 'write',
  desc: '登出 Docker Registry'
},

{
  label: '──── Docker Image ────',
  value: '',
  risk: null,
  desc: ``
},
{
  label: 'docker images',
  value: 'docker images',
  risk: 'safe',
  desc: '查看本機所有 Image'
},
{
  label: 'docker image ls',
  value: 'docker image ls',
  risk: 'safe',
  desc: '列出所有 Image'
},
{
  label: 'docker pull',
  value: 'docker pull image:tag',
  risk: 'write',
  desc: '下載 Image'
},
{
  label: 'docker push',
  value: 'docker push image:tag',
  risk: 'write',
  desc: '推送 Image 到 Registry'
},
{
  label: 'docker build',
  value: 'docker build -t image:tag .',
  risk: 'write',
  desc: '建立 Image'
},
{
  label: 'docker tag',
  value: 'docker tag source:tag target:tag',
  risk: 'write',
  desc: '重新標記 Image'
},
{
  label: 'docker inspect image',
  value: 'docker inspect ${image-name}',
  risk: 'safe',
  desc: '查看 Image 詳細資訊'
},
{
  label: 'docker history',
  value: 'docker history ${image-name}',
  risk: 'safe',
  desc: '查看 Image Layer'
},
{
  label: 'docker rmi',
  value: 'docker rmi ${image-name}',
  risk: 'danger',
  desc: '刪除 Image'
},
{
  label: 'docker image prune',
  value: 'docker image prune',
  risk: 'danger',
  desc: '刪除未使用 Image'
},

{
  label: '──── Docker Container ────',
  value: '',
  risk: null,
  desc: ``
},
{
  label: 'docker ps',
  value: 'docker ps',
  risk: 'safe',
  desc: '查看執行中的 Container'
},
{
  label: 'docker ps -a',
  value: 'docker ps -a',
  risk: 'safe',
  desc: '查看所有 Container'
},
{
  label: 'docker run',
  value: 'docker run image:tag',
  risk: 'write',
  desc: '建立並啟動 Container'
},
{
  label: 'docker start',
  value: 'docker start ${container}',
  risk: 'write',
  desc: '啟動 Container'
},
{
  label: 'docker stop',
  value: 'docker stop ${container}',
  risk: 'write',
  desc: '停止 Container'
},
{
  label: 'docker restart',
  value: 'docker restart ${container}',
  risk: 'write',
  desc: '重新啟動 Container'
},
{
  label: 'docker pause',
  value: 'docker pause ${container}',
  risk: 'write',
  desc: '暫停 Container'
},
{
  label: 'docker unpause',
  value: 'docker unpause ${container}',
  risk: 'write',
  desc: '恢復 Container'
},
{
  label: 'docker exec',
  value: 'docker exec -it ${container} bash',
  risk: 'write',
  desc: '進入 Container'
},
{
  label: 'docker logs',
  value: 'docker logs -f ${container}',
  risk: 'safe',
  desc: '查看 Container Log'
},
{
  label: 'docker inspect',
  value: 'docker inspect ${container}',
  risk: 'safe',
  desc: '查看 Container 詳細資訊'
},
{
  label: 'docker top',
  value: 'docker top ${container}',
  risk: 'safe',
  desc: '查看 Container 內程序'
},
{
  label: 'docker stats',
  value: 'docker stats',
  risk: 'safe',
  desc: '查看 Container 資源使用'
},
{
  label: 'docker cp',
  value: 'docker cp container:/path ./',
  risk: 'write',
  desc: 'Container 與本機互相複製檔案'
},
{
  label: 'docker rename',
  value: 'docker rename old new',
  risk: 'write',
  desc: '重新命名 Container'
},
{
  label: 'docker commit',
  value: 'docker commit container image:new',
  risk: 'write',
  desc: '將 Container 建立成 Image'
},
{
  label: 'docker rm',
  value: 'docker rm ${container}',
  risk: 'danger',
  desc: '刪除 Container'
},
{
  label: 'docker rm -f',
  value: 'docker rm -f ${container}',
  risk: 'danger',
  desc: '強制刪除 Container'
},
{
  label: 'docker container prune',
  value: 'docker container prune',
  risk: 'danger',
  desc: '刪除所有停止中的 Container'
},

{
  label: '──── Docker Network ────',
  value: '',
  risk: null,
  desc: ``
},
{
  label: 'docker network ls',
  value: 'docker network ls',
  risk: 'safe',
  desc: '查看 Network'
},
{
  label: 'docker network inspect',
  value: 'docker network inspect network',
  risk: 'safe',
  desc: '查看 Network 詳細資訊'
},
{
  label: 'docker network create',
  value: 'docker network create network',
  risk: 'write',
  desc: '建立 Network'
},
{
  label: 'docker network rm',
  value: 'docker network rm network',
  risk: 'danger',
  desc: '刪除 Network'
},

{
  label: '──── Docker Volume ────',
  value: '',
  risk: null,
  desc: ``
},
{
  label: 'docker volume ls',
  value: 'docker volume ls',
  risk: 'safe',
  desc: '查看 Volume'
},
{
  label: 'docker volume inspect',
  value: 'docker volume inspect volume',
  risk: 'safe',
  desc: '查看 Volume 詳細資訊'
},
{
  label: 'docker volume create',
  value: 'docker volume create volume',
  risk: 'write',
  desc: '建立 Volume'
},
{
  label: 'docker volume rm',
  value: 'docker volume rm volume',
  risk: 'danger',
  desc: '刪除 Volume'
},
{
  label: 'docker volume prune',
  value: 'docker volume prune',
  risk: 'danger',
  desc: '刪除未使用 Volume'
},

{
  label: '──── Docker Cleanup ────',
  value: '',
  risk: null,
  desc: ``
},
{
  label: 'docker system df',
  value: 'docker system df',
  risk: 'safe',
  desc: '查看 Docker 空間使用'
},
{
  label: 'docker system prune',
  value: 'docker system prune',
  risk: 'danger',
  desc: '清除未使用資源'
},
{
  label: 'docker system prune -a',
  value: 'docker system prune -a',
  risk: 'danger',
  desc: '清除所有未使用 Image、Container、Network'
},
{
  label: 'docker system prune -a --volumes',
  value: 'docker system prune -a --volumes',
  risk: 'danger',
  desc: '清除所有未使用資源（包含 Volume）'
}
] 