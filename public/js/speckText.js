function speakText(text,lang="zh-TW"){
// 建立要朗讀的文字實例
const utterance = new SpeechSynthesisUtterance(text);

// 設定語言（例如繁體中文）
utterance.lang = lang;

// 設定語速 (範圍通常為 0.1 到 10，預設為 1)
utterance.rate = 1.0;

// 設定音調 (範圍為 0 到 2，預設為 1)
utterance.pitch = 1.0;

// 觸發瀏覽器進行語音朗讀
window.speechSynthesis.speak(utterance);
}

/**
 https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/
  
 */