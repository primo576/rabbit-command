




ALL_TEMPLATE={

 KUBECTL_TEMPLATE_CONFIG : [
  // ======================
  // 0. 自訂
  // ======================
  {
    label: '— 自訂 —',
    value: '',
    risk: 'custom',
    desc: ``
  },

  // ======================
  // 1. 總覽 / 快速確認
  // ======================
  {
    label: '==================1. 總覽 / 快速確認===================',
    value: '',
    risk: null,
    desc: ``
  },

  {
    label: 'get all（✅安全｜總覽）',
    value: 'kubectl get all -n ${ns}',
    risk: 'safe',
    desc: `看整體狀態（第一個會打）
一次看 deploy / rs / pod / svc
快速判斷「東西到底有沒有起來」`
  },
  {
    label: 'get deploy（✅安全｜列表）',
    value: 'kubectl get deploy -n ${ns}',
    risk: 'safe'
  },
  {
    label: '取得 Pods（✅安全｜列表）',
    value: 'kubectl get pods -n ${ns}',
    risk: 'safe'
  },
  {
    label: 'Pod 狀態快速總覽（✅安全｜wide）',
    value: 'kubectl get pods -n ${ns} -o wide',
    risk: 'safe',
    desc: `重點看：
NODE / IP
Pod 是否集中在同一台 node（資源風險）`
  },

  // ======================
  // 2. Deployment / Pod 詳細
  // ======================
  {
    label: '==================2. Deployment / Pod 詳細=============',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: 'describe pod（✅安全｜細節）',
    value: 'kubectl describe pod ${pod} -n ${ns} | grep -E -w "Name:|Time:|Image:|Status:"',
    risk: 'safe',
    desc: `不接-n 就是集群搜索 也可以接上  "Image:" 看板號
    Status: 看狀態
    -w 全字符合
    `
  },
  {
    label: 'describe deployment（✅安全｜細節）',
    value: 'kubectl describe deployment ${deployment} -n ${ns}',
    risk: 'safe'
  },
  {
    label: 'Pod 為什麼不是 Running（✅安全｜必查）',
    value: 'kubectl describe pod ${pod} -n ${ns}',
    risk: 'safe',
    desc: `99% 問題在 Events：
- ImagePullBackOff
- CrashLoopBackOff
- Readiness / Liveness probe failed`
  },

  // ======================
  // 3. Log / Crash 排查
  // ======================
  {
    label: '==================3. Log / Crash 排查==================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '即時追 pod log（✅安全）',
    value: 'kubectl logs -f ${pod} -n ${ns}',
    risk: 'safe',
    desc: `即時觀察單一 Pod log`
  },
  {
    label: '看「上一版」log（CrashLoop 神技）',
    value: 'kubectl logs ${pod} -n ${ns} --previous',
    risk: 'safe',
    desc: `Pod 一直重啟時一定要用`
  },

  // ======================
  // 4. Rollout / 發佈狀態
  // ======================
  {
    label: '==================4. Rollout / 發佈狀態=================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '查看 rollout 狀態（✅安全｜CI/CD）',
    value: 'kubectl rollout status deploy ${deployment} -n ${ns}',
    risk: 'safe',
    desc: `卡住通常代表：
- Pod 起不來
- readiness failed`
  },

  // ======================
  // 5. Service / Ingress
  // ======================
  {
    label: '==================5. Service / Ingress==================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '查看 ingress yaml（✅安全）',
    value: 'kubectl get ingress ${ingressName} -n ${ns} -o yaml',
    risk: 'safe',
    desc: `確認路由是否存在
例：
ph get ingress gocron -n gocron -o yaml
br get ingress gocron.com -n gocron -o yaml`
  },
  {
    label: '查看 ingress（✅安全｜全部）',
    value: 'kubectl get ingress -A',
    risk: 'safe'
  },


  // ======================
  // 6. 流程型排障（整套）
  // ======================
  {
    label: '==================6. 流程型排障（整套）=================',
    value: '',
    risk: null,
    desc: ``
  },

  
  {
    "label": "exec 進 Pod（互動 shell）",
    "value": "kubectl exec -it ${pod} -n ${ns} -- /bin/sh",
    "risk": "medium",
    "desc": "進入 Pod 內執行互動式 shell，常用於除錯。實際 shell 依映像檔可能是 sh 或 bash。"
  },
  {
    "label": "exec 進 Pod（bash）",
    "value": "kubectl exec -it ${pod} -n ${ns} -- /bin/bash",
    "risk": "medium",
    "desc": "直接使用 bash 進入 Pod，僅適用於容器內有安裝 bash 的情況。"
  },
  {
    "label": "exec 指定 container",
    "value": "kubectl exec -it ${pod} -c ${container} -n ${ns} -- /bin/sh",
    "risk": "medium",
    "desc": "當 Pod 內有多個 container 時，必須指定 container 才能 exec。"
  },
  {
    "label": "exec 執行單一指令",
    "value": "kubectl exec ${pod} -n ${ns} -- ls /",
    "risk": "low",
    "desc": "不進入互動模式，僅在 Pod 內執行一次指令並回傳結果。"
  },
  {
    "label": "exec 查看環境變數",
    "value": "kubectl exec ${pod} -n ${ns} -- env",
    "risk": "low",
    "desc": "列出 Pod 內所有環境變數，注意可能包含敏感資訊。"
  },
  {
    "label": "exec 進 Pod（stdin 關閉）",
    "value": "kubectl exec ${pod} -n ${ns} -- /bin/sh -c \"${cmd}\"",
    "risk": "medium",
    "desc": "以非互動方式執行較複雜指令，適合自動化或腳本使用。"
  },
  {
    "label": "exec 進 Pod（root 使用者）",
    "value": "kubectl exec -it ${pod} -n ${ns} -- su -",
    "risk": "high",
    "desc": "嘗試切換為 root 使用者，僅在容器允許且安全情境下使用。"
  },


  {
    label: '排障標準流程（GPT 建議）',
    value:
      'kubectl get pods -n ${ns}\n' +
      'kubectl describe pod ${pod} -n ${ns}\n' +
      'kubectl logs ${pod} -n ${ns}\n' +
      'kubectl logs ${pod} -n ${ns} --previous\n' +
      'kubectl get svc -n ${ns}\n' +
      'kubectl get endpoints ${svc} -n ${ns}',
    risk: 'safe',
    desc: `服務異常時使用
約 8 成問題可定位`
  },

  // ======================
  // 7. 影響線上（Danger 區）br scale deployment web --replicas=0 -n 「NS」
  // ======================
  {
    label: '==================7. 影響線上（Danger 區）===============',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '調整pod數量（⚠️影響線上）（未驗收站點誤發）',
    value: 'kubectl scale deployment ${deployment} --replicas=${num} -n ${ns}',
    risk: 'danger',
    desc: '會立即調整deploy的pod數量,未上線站點調整為0 replicas'
  },
  {
    label: '重新部署 rollout restart（⚠️影響線上）',
    value: 'kubectl rollout restart deployment ${deployment} -n ${ns}',
    risk: 'danger',
    desc: '會重建 Pods（通常不中斷，但有風險）'
  },
  {
    label: '重新部署 gocron（⚠️影響線上）',
    value: 'kubectl rollout restart deployment gocron-${ns} -n gocron',
    risk: 'danger'
  },
  {
    label: 'delete pod（⚠️影響線上）',
    value: 'kubectl delete pod ${pod} -n ${ns}',
    risk: 'danger'
  },
  {
    label: '回滾上一版本（⚠️影響線上）',
    value: 'kubectl rollout undo deploy ${deployment} -n ${ns}',
    risk: 'danger'
  },
  {
    label: 'delete deployment（⚠️高風險）',
    value: 'kubectl delete deployment ${deployment} -n ${ns}',
    risk: 'danger',
    desc: '刪除 Deployment（不可逆）'
  },

  {
  label: 'kubectl edit',
  value: 'kubectl edit ${resource} ${name} -n ${namespace}',
  risk: 'danger',
  desc: `
用途：
- 直接在線上編輯 Kubernetes 資源（Deployment / Service / Ingress 等）
- 適合臨時調整、快速修 bug、緊急排錯

行為特性：
- 存檔即生效（立即 PATCH 到 API Server）
- 不存檔直接離開 = 不會有任何變更
- 無版本控管、不可 review

風險說明：
- 容易手滑改錯（尤其是 Ingress、Selector、Image）
- 變更立即影響線上流量
- 不適合長期或正式設定

常見使用情境：
- 臨時改 Ingress host / path
- 緊急修正 annotation
- 快速驗證設定是否可行
| 你看到的              | resource     |
| --------------------| ------------ |
| kubectl get pod     | pod        |
| kubectl get svc     | service   |
| kubectl get deploy  | deployment |
| kubectl get ingress | ingress    |
| kubectl get cm      | configmap  |
| kubectl get secret  | secret    |
<name>
kubectl get ingress -n gocron

edit 背後在做什麼（你應該知道的）
kubectl edit 本質是：
把目前資源抓下來
開成暫存檔
存檔時 → kubectl apply
👉 所以 效果等同於 apply`
},

{
  label: 'kubectl apply',
  value: 'kubectl apply -f ${file_yaml}',
  risk: 'danger',
  desc: `
用途：
- 將檔案中的 YAML 宣告式套用到叢集
- 正式部署、設定變更的標準方式

行為特性：
- 會對現有資源做 create / update
- 可搭配 Git 進行版本控管（GitOps）
- 變更是可重現的

風險說明：
- YAML 若錯誤會直接影響線上
- 不小心 apply 錯 namespace / 檔案，影響範圍可能很大
- managedFields、selector、volume 改錯可能造成 service 中斷

常見使用情境：
- CI/CD pipeline
- Deployment / Ingress 正式上線
- 設定回滾（rollback）`
},

{
  label: 'kubectl diff',
  value: 'kubectl diff -f ${file_yaml}',
  risk: 'safe',
  desc: `
用途：
- 比對本地 YAML 與線上資源的差異
- 預覽 apply 後會發生什麼事

行為特性：
- 不會對叢集造成任何修改
- 適合在 apply 前做檢查

常見使用情境：
- production apply 前驗證
- Code Review 輔助
`
},



  // ======================
  // 8. 參考模板
  // ======================
  {
    label: '==================8. 建站參考模板======================',
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
  },
  {
    label: 'Step2: ns0-9建站腳本用',
    value: `\${ns}0,\${ns}1,\${ns}2,\${ns}3,\${ns}4,\${ns}5,\${ns}6,\${ns}7,\${ns}8,\${ns}9,`,
    risk: 'safe',
    desc: `建站腳本用 要記得刪除最後的,`
  },
  /*
  {
    label: '(略)升級腳本用 ns轉array',
    value: '"${ns}",',
    risk: 'safe',
    desc: ` 產出後貼到網址會一排`
  },*/
  {
    label: 'Step3: ns9-0升級腳本用',
    value: `"\${nsre}9","\${nsre}8","\${nsre}7","\${nsre}6","\${nsre}5","\${nsre}4","\${nsre}3","\${nsre}2","\${nsre}1","\${nsre}0",`,
    risk: 'safe',
    desc: `abc -> cba
升級腳本用的順序是倒序 最新的在最上面 和表順序相反`
  },
  {
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
],



SYSTEMCTL_TEMPLATE_CONFIG :[
  // ======================
  // 0. 自訂
  // ======================
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
    desc: ``
  },

  // ======================
  // 1. 服務總覽 / 存在性確認
  // ======================
  {
    label: '列出所有已安裝服務（✅安全｜全部）',
    value: 'systemctl list-unit-files --type=service',
    risk: 'safe',
     desc: `
查看系統中「有哪些 service 定義檔存在」（不是是否正在執行）

欄位說明：
• UNIT FILE：服務定義檔名稱（service 本身）
• STATE：是否設定為「開機自動啟動」
  - enabled：開機會自動啟動
  - disabled：不會開機自動啟動
  - static：不能單獨啟用，只能被其他服務依賴啟動
  - masked：被完全封鎖，無法啟動
• PRESET：發行版官方建議的預設狀態（建議值，非目前狀態）

⚠️ 注意：
此指令「不代表服務是否正在運行」
需搭配 systemctl status <service> 查看實際執行狀態
`
  },
  {
    label: '列出開機會啟動的服務（✅安全｜enabled）',
    value: 'systemctl list-unit-files --type=service --state=enabled',
    risk: 'safe',
    desc: `確認哪些服務會在開機時自動啟動`
  },
  {
    label: '搜尋特定服務是否存在（✅安全）',
    value: 'systemctl list-unit-files | grep ${service}',
    risk: 'safe',
    desc: `快速確認 service 是否存在`
  },

  // ======================
  // 2. 目前運行狀態
  // ======================
  {
    label: '列出目前運行中的服務（✅安全）',
    value: 'systemctl list-units --type=service',
    risk: 'safe',
    desc: `查看目前 active / failed / activating 的服務`
  },
  {
    label: '只看正在 running 的服務（✅安全）',
    value: 'systemctl list-units --type=service --state=running',
    risk: 'safe'
  },
  {
    label: '查看失敗的服務（❗排障必看）',
    value: 'systemctl --failed',
    risk: 'safe',
    desc: `快速定位啟動失敗的 service`
  },

  // ======================
  // 3. 單一服務詳細狀態（排障核心）
  // ======================
  {
    label: '查看服務狀態（✅安全｜必查）',
    value: 'systemctl status ${service}',
    risk: 'safe',
    desc: `第一個一定會打的指令
重點看：
- Active 狀態
- Main PID
- 最後幾行 log`
  },
  {
    label: '查看 service 定義檔（✅安全）',
    value: 'systemctl cat ${service}',
    risk: 'safe',
    desc: `確認 ExecStart / User / EnvironmentFile`
  },

  // ======================
  // 4. Log / 問題定位
  // ======================
  {
    label: '查看 service 歷史 log（✅安全）',
    value: 'journalctl -u ${service}',
    risk: 'safe'
  },
  {
    label: '查看本次開機的 log（✅安全）',
    value: 'journalctl -u ${service} -b',
    risk: 'safe',
    desc: `排查「重開機後起不來」`
  },
  {
    label: '即時追蹤 service log（✅安全）',
    value: 'journalctl -u ${service} -f',
    risk: 'safe',
    desc: `即時觀察服務輸出`
  },
  {
    label: '只看錯誤等級 log（❗快速掃雷）',
    value: 'journalctl -u ${service} -p err',
    risk: 'safe'
  },

  // ======================
  // 5. 開機 / 啟動問題
  // ======================
  {
    label: '確認是否為開機啟動（✅安全）',
    value: 'systemctl is-enabled ${service}',
    risk: 'safe'
  },
  {
    label: '查看開機啟動耗時（⚠️效能排查）',
    value: 'systemd-analyze blame',
    risk: 'safe',
    desc: `找出拖慢開機的服務`
  },
  {
    label: '查看關鍵啟動鏈（⚠️進階）',
    value: 'systemd-analyze critical-chain',
    risk: 'safe'
  },

  // ======================
  // 6. 影響線上（Danger 區）
  // ======================
  {
    label: '啟動服務（⚠️影響線上）',
    value: 'systemctl start ${service}',
    risk: 'danger'
  },
  {
    label: '重啟服務（⚠️影響線上）',
    value: 'systemctl restart ${service}',
    risk: 'danger',
    desc: `設定變更後常用，會中斷服務`
  },
  {
    label: '重新載入設定（⚠️需支援）',
    value: 'systemctl reload ${service}',
    risk: 'danger',
    desc: `需 service 支援 ExecReload`
  },
  {
    label: '停止服務（⚠️高風險）',
    value: 'systemctl stop ${service}',
    risk: 'danger'
  },
  {
    label: '設定開機自動啟動（⚠️變更系統狀態）',
    value: 'systemctl enable ${service}',
    risk: 'danger'
  },
  {
    label: '取消開機自動啟動（⚠️變更系統狀態）',
    value: 'systemctl disable ${service}',
    risk: 'danger'
  }
],

LINUX_BASIC_TEMPLATE_CONFIG : [
  // ======================
  // 0. 自訂
  // ======================
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
    desc: ``
  },

  // ======================
  // 1. 檔案 / 目錄（只讀）
  // ======================
  {
    label: '查看目錄本身權限（✅安全｜ls -ld）',
    value: 'ls -ld ${path}',
    risk: 'safe',
    desc: `確認目錄本身的 owner / group / 權限
排查 Permission denied 必用`
  },
  {
    label: '查看檔案清單（✅安全｜人類可讀）',
    value: 'ls -lh ${path}',
    risk: 'safe'
  },
  {
    label: '查看檔案詳細資訊（✅安全｜stat）',
    value: 'stat ${file}',
    risk: 'safe',
    desc: `inode / owner / time 全部看得到`
  },
  {
    label: '透過pid查看檔案位置（✅安全｜stat）',
    value: 'ls -l /proc/${pid}/exe',
    risk: 'safe',
    desc: ``
  },

  // ======================
  // 2. 磁碟 / 空間（高頻）
  // ======================
  {
    label: '查看磁碟使用狀況（✅安全｜df -h）',
    value: 'df -h',
    risk: 'safe',
    desc: `服務異常時第一個檢查
磁碟滿 = 各種怪問題`
  },
  {
    label: '查看目錄大小（✅安全｜du -sh）',
    value: 'du -sh ${path}',
    risk: 'safe'
  },
  {
    label: '找出肥大目錄（✅安全｜排序）',
    value: 'du -sh * | sort -h',
    risk: 'safe',
    desc: `快速找出吃空間的兇手`
  },

  // ======================
  // 3. 程序 / 資源
  // ======================
  {
    label: '查看程序（✅安全｜ps）',
    value: 'ps aux | grep ${keyword}',
    risk: 'safe',
    desc: `確認服務是否真的有跑`
  },
 {
    label: '查看程序啟動命令（✅安全｜ps）',
    value: 'ps -ef | grep ${keyword}',
    risk: 'safe',
    desc: `確認服務是否真的有跑`
  },
  {
    label: '即時資源監控（✅安全｜top）',
    value: 'top',
    risk: 'safe'
  },
  {
    label: '記憶體使用狀況（✅安全｜free）',
    value: 'free -h',
    risk: 'safe',
    desc: `排查 OOM / 記憶體不足`
  },
  {
    label: '系統負載（✅安全｜uptime）',
    value: 'uptime',
    risk: 'safe',
    desc: `load average 判斷系統壓力`
  },

  // ======================
  // 4. Port / Network
  // ======================
  {
    label: '查看監聽中的 port（✅安全｜ss）',
    value: 'ss -lntp',
    risk: 'safe',
    desc: `查 port 是否被佔用（取代 netstat）`
  },
  {
    label: '查特定 port 被誰佔用（✅安全）',
    value: 'lsof -i :${port}',
    risk: 'safe'
  },

  // ======================
  // 5. Log / 文字查看
  // ======================
  {
    label: '即時追 log（✅安全｜tail）',
    value: 'tail -f ${file}',
    risk: 'safe'
  },
  {
    label: '可回滾追 log（✅安全｜less +F）',
    value: 'less +F ${file}',
    risk: 'safe',
    desc: `比 tail -f 好用，可向上捲`
  },
  {
    label: '搜尋錯誤關鍵字（✅安全｜grep）',
    value: 'grep -R "ERROR" ${path}',
    risk: 'safe'
  },

  // ======================
  // 6. 使用者 / 權限
  // ======================
  {
    label: '查看目前使用者（✅安全）',
    value: 'whoami',
    risk: 'safe'
  },
  {
    label: '查看使用者資訊（✅安全｜id）',
    value: 'id ${user}',
    risk: 'safe',
    desc: `服務權限問題必查`
  },

  // ======================
  // 7. 影響系統（Danger 區）
  // ======================
  {
    label: '刪除檔案（⚠️高風險）',
    value: 'rm ${file}',
    risk: 'danger'
  },
  {
    label: '強制刪除目錄（⚠️極高風險）',
    value: 'rm -rf ${path}',
    risk: 'danger',
    desc: `⚠️ 建議加二次確認`
  },
  {
    label: '修改權限（⚠️影響系統）',
    value: 'chmod ${mode} ${path}',
    risk: 'danger'
  },
  {
    label: '修改擁有者（⚠️影響系統）',
    value: 'chown ${user}:${group} ${path}',
    risk: 'danger'
  },
  {
    label: '強制結束程序（⚠️影響線上）',
    value: 'kill -9 ${pid}',
    risk: 'danger'
  },
  //tips
  {
    label: 'command line紀錄路徑（✅安全｜top）',
    value: 'pushd;dirs;popd;',
    risk: 'safe',
    desc:`pushd。紀錄路徑
dirs。顯示所有紀錄路徑
popd。刪除路徑`
  }
  


],

LINUX_SED_TEMPLATE_CONFIG :[
//sed used
  
  {
    label: '基本替換（單行）',
    value: "sed 's/\${old}/\${new}/' \${file}",
    risk: 'safe',
    desc: `將每一行中第一個出現的 \${old} 替換成 \${new}
- 只替換「每行第一個」匹配到的字串
- 不會改變原始檔案，只輸出結果到畫面`
  },
  {
    label: '全域替換（每行全部）',
    value: "sed 's/\${old}/\${new}/g' \${file}",
    risk: 'safe',
    desc: `將每一行中所有出現的 \${old} 全部替換成 \${new}
- g = global
- 常見用法：批次改字串`
  },
  {
    label: '忽略大小寫替換',
    value: "sed 's/\${old}/\${new}/gi' \${file}",
    risk: 'safe',
    desc: `忽略大小寫進行替換
- i = ignore case
- \${old} / \${old} / \${old} 都會被替換`
  },
  {
    label: '只顯示被替換的行',
    value: "sed -n 's/\${old}/\${new}/p' \${file}",
    risk: 'safe',
    desc: `只輸出「有發生替換」的行
- -n：關閉預設輸出
- p：print（搭配 s/// 使用）
- 常用於 debug 或檢查影響範圍`
  },
  {
    label: '直接修改檔案（in-place）',
    value: "sed -i 's/\${old}/\${new}/g' \${file}",
    risk: 'danger',
    desc: `直接修改原始檔案內容
⚠️ 有風險，請先備份
- -i = in-place
- 建議先用不加 -i 確認結果`
  },
  {
    label: '修改檔案並保留備份',
    value: "sed -i.bak 's/\${old}/\${new}/g' \${file}",
    risk: 'safe',
    desc: `修改檔案並自動產生備份檔
- 會產生 \${file}.bak
- 比單純 -i 安全`
  },
  {
    label: '只替換第 N 行',
    value: "sed '3s/\${old}/\${new}/' \${file}",
    risk: 'safe',
    desc: `只替換第 3 行的 \${old}
- 可用在「只想改特定行數」的情境`
  },
  {
    label: '指定範圍行數替換',
    value: "sed '3,10s/\${old}/\${new}/g' \${file}",
    risk: 'safe',
    desc: `只替換第 3~10 行內的 \${old}
- 範圍控制非常實用
- 常見於設定檔修正`
  },
  {
    label: '刪除包含關鍵字的行',
    value: "sed '/keyword/d' \${file}",
    risk: 'safe',
    desc: `刪除包含 keyword 的整行
- d = delete
- 常用來過濾 log`
  },
  {
    label: '只顯示包含關鍵字的行',
    value: "sed -n '/keyword/p' \${file}",
    risk: 'safe',
    desc: `只顯示包含 keyword 的行
- 類似 grep，但用 sed 寫法`
  },
  {
    label: '多個替換規則',
    value: "sed -e 's/a/b/g' -e 's/c/d/g' \${file}",
    risk: 'safe',
    desc: `一次執行多個替換規則
- 依序執行
- 複雜轉換時很好用`
  },
  {
    label: '使用正則表達式替換',
    value: "sed -E 's/[0-9]+/NUM/g' \${file}",
    risk: 'safe',
    desc: `使用正則表達式進行替換
- -E 啟用擴展正則
- 將所有數字改成 NUM`
  }
],

LINUX_Awk_TEMPLATE_CONFIG:[
  
  {
    label: '印出整行（預設行為）',
    value: "awk '{print $0}' file.txt",
    risk: 'safe',
    desc: `印出每一整行內容
- $0 代表整行
- 不寫 print 其實也會預設印出整行`
  },
  {
    label: '印出指定欄位（第 1、第 3 欄）',
    value: "awk '{print $1, $3}' file.txt",
    risk: 'safe',
    desc: `印出第 1 欄與第 3 欄
- 預設以「空白」做欄位切割
- 常用於 log / 表格資料`
  },
  {
    label: '指定分隔符（用冒號切）',
    value: "awk -F ':' '{print $1, $3}' /etc/passwd",
    risk: 'safe',
    desc: `指定分隔符為冒號 :
- -F 用來指定欄位分隔符
- 常見解析 /etc/passwd`
  },
  {
    label: '條件過濾（第 3 欄大於 1000）',
    value: "awk '$3 > 1000 {print $0}' file.txt",
    risk: 'safe',
    desc: `只有當第 3 欄 > 1000 才輸出
- awk 天生就內建條件判斷
- 可用於過濾數值`
  },
  {
    label: '關鍵字過濾（包含 error）',
    value: "awk '/error/ {print $0}' app.log",
    risk: 'safe',
    desc: `只輸出包含 error 的行
- /pattern/ 是正則比對
- 功能類似 grep，但可同時做欄位處理`
  },
  {
    label: '計算總和（第 2 欄加總）',
    value: "awk '{sum += $2} END {print sum}' data.txt",
    risk: 'safe',
    desc: `將第 2 欄所有數值加總
- END 區塊代表所有行處理完後才執行
- 常用於統計`
  },
  {
    label: '顯示行號 + 內容',
    value: "awk '{print NR, $0}' file.txt",
    risk: 'safe',
    desc: `顯示行號 + 原始內容
- NR = 目前是第幾行
- 除錯、檢視特定行很方便`
  },
  {
    label: '欄位數量判斷（只印出有 3 欄的行）',
    value: "awk 'NF == 3 {print $0}' file.txt",
    risk: 'safe',
    desc: `只印出欄位數為 3 的行
- NF = Number of Fields（欄位數）
- 過濾不完整資料很好用`
  },
  {
    label: '字串替換（sub）',
    value: "awk '{sub(/old/, \"new\"); print}' file.txt",
    risk: 'safe',
    desc: `將每一行第一個 old 替換為 new
- sub = 只換第一個
- print 可省略`
  },
  {
    label: '字串全域替換（gsub）',
    value: "awk '{gsub(/old/, \"new\"); print}' file.txt",
    risk: 'safe',
    desc: `將每一行所有 old 全部替換成 new
- gsub = global substitute
- 等同 sed 的 g`
  },
  {
    label: 'BEGIN / END 範例（加表頭表尾）',
    value: "awk 'BEGIN {print \"START\"} {print $0} END {print \"END\"}' file.txt",
    risk: 'safe',
    desc: `在輸出前後加上自訂文字
- BEGIN：處理資料前
- END：處理資料後
- 常用於產生報表`
  },
  {
    label: '指定輸出分隔符號',
    value: "awk -F ',' 'BEGIN {OFS=\"\\t\"} {print $1, $2}' data.csv",
    risk: 'safe',
    desc: `輸入用逗號切，輸出用 tab 分隔
- -F 指定輸入分隔符
- OFS 指定輸出分隔符`
  }


],

GIT_BASIC_TEMPLATE_CONFIG :[
  {
    label: '查看目前狀態',
    value: 'git status',
    risk: 'safe',
    desc: '查看目前工作目錄與暫存區狀態，最常用的安全指令'
  },
  {
    label: '查看提交紀錄',
    value: 'git log --oneline --graph --decorate',
    risk: 'safe',
    desc: '用精簡方式查看 commit 歷史與分支關係'
  },
  {
    label: '查看遠端倉庫',
    value: 'git remote -v',
    risk: 'safe',
    desc: '列出遠端倉庫名稱與 URL'
  },
  {
    label: '新增檔案到暫存區',
    value: 'git add .',
    risk: 'low',
    desc: '將所有變更加入暫存區，注意可能會加到不想提交的檔案'
  },
  {
    label: '提交變更',
    value: 'git commit -m "${message}"',
    risk: 'safe',
    desc: '將暫存區內容提交成一個 commit'
  },
  {
    label: '查看分支',
    value: 'git branch',
    risk: 'safe',
    desc: '查看本地分支列表'
  },
  {
    label: '切換分支',
    value: 'git checkout ${branchname}',
    risk: 'safe',
    desc: '切換到指定分支（舊寫法）'
  },
  {
    label: '建立並切換分支',
    value: 'git checkout -b ${branchname}',
    risk: 'safe',
    desc: '建立新分支並立即切換'
  },
  {
    label: '切換分支（新版）',
    value: 'git switch ${branchname}',
    risk: 'safe',
    desc: '新版指令，專門用來切換分支，語意更清楚'
  },
  {
    label: '拉取遠端更新',
    value: 'git pull',
    risk: 'medium',
    desc: '拉取並合併遠端變更，可能產生 merge conflict'
  },
  {
    label: '推送到遠端',
    value: 'git push',
    risk: 'medium',
    desc: '將本地 commit 推送到遠端倉庫'
  },
  {
    label: '查看差異',
    value: 'git diff',
    risk: 'safe',
    desc: '查看尚未加入暫存區的檔案差異'
  },
  {
    label: '查看已暫存差異',
    value: 'git diff --staged',
    risk: 'safe',
    desc: '查看已加入暫存區但尚未提交的差異'
  },
  {
    label: '暫存目前修改',
    value: 'git stash',
    risk: 'low',
    desc: '暫時保存目前變更，工作目錄會回到乾淨狀態'
  },
  {
    label: '還原暫存修改',
    value: 'git stash pop',
    risk: 'medium',
    desc: '取回暫存內容並套用，可能發生衝突'
  },
  {
    label: '重置檔案（取消 add）',
    value: 'git reset HEAD ${file}',
    risk: 'medium',
    desc: '將檔案從暫存區移回工作目錄'
  },
  {
    label: '還原檔案內容',
    value: 'git checkout -- ${file}',
    risk: 'high',
    desc: '放棄檔案的所有本地修改，無法復原'
  },
  {
    label: '強制同步遠端分支',
    value: 'git fetch --all && git reset --hard origin/main',
    risk: 'high',
    desc: '完全以遠端狀態覆蓋本地，會遺失本地修改'
  },
  
  {
    label: '合併指定分支到目前分支',
    value: 'git merge branch-name',
    risk: 'medium',
    desc: '將指定分支合併到目前所在分支，可能產生衝突'
  },
  {
    label: '使用 no-ff 合併（保留分支紀錄）',
    value: 'git merge --no-ff branch-name',
    risk: 'medium',
    desc: '即使可以 fast-forward 也強制建立 merge commit，適合主分支流程'
  },
  {
    label: '中止合併（發生衝突時）',
    value: 'git merge --abort',
    risk: 'low',
    desc: '在 merge 發生衝突時，回到合併前的狀態'
  },
  {
    label: '查看哪些分支已被合併',
    value: 'git branch --merged',
    risk: 'safe',
    desc: '列出已合併進目前分支的本地分支'
  },
  {
    label: '查看哪些分支尚未合併',
    value: 'git branch --no-merged',
    risk: 'safe',
    desc: '列出尚未合併進目前分支的分支'
  },
  {
    label: '刪除已合併的本地分支',
    value: 'git branch -d branch-name',
    risk: 'low',
    desc: '刪除已合併完成的本地分支（安全刪除）'
  },
  {
    label: '強制刪除本地分支',
    value: 'git branch -D branch-name',
    risk: 'high',
    desc: '強制刪除分支，不論是否已合併，可能遺失工作'
  },
  {
    label: '使用 rebase 合併分支',
    value: 'git rebase branch-name',
    risk: 'high',
    desc: '將目前分支的提交接到指定分支後方，會改寫 commit 歷史'
  },
  {
    label: '中止 rebase',
    value: 'git rebase --abort',
    risk: 'low',
    desc: '在 rebase 發生衝突時，回到 rebase 前狀態'
  },
  {
    label: '繼續 rebase（解完衝突）',
    value: 'git rebase --continue',
    risk: 'medium',
    desc: '衝突解決後繼續 rebase 流程'
  },
  {
    label: '將遠端分支合併到本地',
    value: 'git fetch origin && git merge origin/branch-name',
    risk: 'medium',
    desc: '先抓遠端更新，再手動合併指定遠端分支'
  },
  {
    label: '同步主分支後再合併',
    value: 'git checkout main && git pull && git merge branch-name',
    risk: 'medium',
    desc: '確保主分支是最新狀態，再合併其他分支'
  },
  {
    label: '查看合併衝突檔案',
    value: 'git status',
    risk: 'safe',
    desc: '合併衝突時查看哪些檔案需要處理'
  },
  {
    label: '查看衝突內容',
    value: 'git diff',
    risk: 'safe',
    desc: '顯示衝突標記（<<<<<< >>>>>>），用於手動解衝突'
  }


]




}

/*
Object.values(ALL_TEMPLATE).forEach(group => {
  if (!Array.isArray(group)) return;

  group.forEach((item, index) => {
    item.index = index;
  });
});
*/
