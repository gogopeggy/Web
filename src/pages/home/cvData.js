// CV content. Originally transcribed from the résumé PDF, since extended
// beyond it.
//
// The source PDF is a two-column layout, so the text was reassembled by glyph
// coordinates rather than reading order. Keep wording verbatim — Home.js is
// layout only, this file is the single source of content.
//
// Experience entry shape:
//   company      display name
//   companyNote  trailing note rendered muted, e.g. '(NASDAQ: Hour)'
//   logo         key into logos.js, or a full http(s) URL
//   role         job title
//   period       date range as displayed
//   current      true for the ongoing role (fills the timeline dot)
//   intro        optional lead-in line above the bullets
//   bullets      [{ label?, short?, text?, children? }]
//                `short` is a condensed label used only in the collapsed
//                one-line summary; `children` nests one level deep.
//
// An entry is collapsible when it has an `intro`, nested `children`, or more
// than one bullet; anything less renders always-open, since a toggle over a
// single line is noise. The collapsed summary prefers the bullets' `short ||
// label` joined, and falls back to the `intro` or the first bullet's text when
// no bullet carries a label — so a collapsed card is never blank.
//
// THIS FILE MUST STAY PURE DATA — no imports, no expressions. It is both the
// offline fallback and the source `scripts/cv-seed.mjs` reads (under Node,
// where PNG imports would fail) to produce the JSON stored in Cloudflare KV.
// Logos are referenced by key and resolved in logos.js.

export const profile = {
	name: '吳珮瑾',
	nameEn: 'Peggy Wu',
	initial: '吳',
	title: '前端工程師',
	email: 'a29098477@gmail.com',
	summary:
		'具備 3 年 React / TypeScript 前端開發經驗，加上將近 5 年美股上市跨境電商營運與產品管理背景，熟悉電商業務並能兼顧使用者體驗與商業目標。擅長開發響應式（RWD）、跨瀏覽器的 Web 應用，串接 RESTful API，並建立可重複使用的共用元件庫。現於台灣大哥大負責服務逾 1,500 帳號的內部系統前端，兼任兩項專案系統分析師，與後端及使用者緊密協作，從需求定義一路交付上線；並擔任團隊 AI 輔助開發導入種子成員。',
};

export const experience = [
	{
		company: '台灣大哥大股份有限公司',
		logo: 'taiwan-mobile',
		role: '前端工程師',
		period: '2025/9 – 仍在職',
		current: true,
		bullets: [
			{
				label: '前端開發（主力）',
				text: '以 React + Vite + TypeScript 開發系統前端，從使用者需求訪談、Figma UI/UX 規劃到介面實作的完整開發流程，將業務需求轉化為元件、可維護且具型別安全的架構。',
			},
			{
				label: '共用元件庫與設計規範',
				short: '共用元件庫',
				text: '建立並持續維護前端共用元件庫，開發新元件並統一樣式與設計邏輯，目前由 50+ 個功能模組共用，新頁面開發時間縮短約 20%。',
			},
			{
				label: '品質與測試',
				text: '上版前依序經 AI Code Review、開發人員 SIT 整合測試及使用者 UAT 驗收測試。',
			},
			{
				label: 'CI/CD 與部署',
				short: 'CI/CD',
				text: '團隊透過輪值的方式上版，透過 Jenkins 執行建置打包，並以 Rancher 搭配 Argo CD 將服務持續部署（CD）至 Kubernetes 環境，確保上版流程穩定且可追蹤。',
			},
			{
				label: '系統分析（SA）',
				short: '系統分析',
				text: '主導需求會議並撰寫規格文件，規劃與 3 個外部系統介接方案，專案於 2026/09 如期上線。',
			},
			{
				label: '後端支援與權限管理',
				short: '後端支援',
				text: '輔助 Java API 開發並獨立支援後端任務，具備前後端整合與全端問題排查能力；同時負責全系統使用者帳號與權限控管，建立權限設定流程。',
			},
			{
				label: 'AI 推動種子成員',
				short: 'AI 推動',
				text: '擔任團隊 AI 輔助開發推動者，將 Claude Code 導入開發流程（AI-SDLC），落地規格驅動開發（Spec-Driven Development），並於部門內分享實踐經驗。',
			},
		],
	},
	{
		company: '橘子跳動有限公司',
		logo: 'jump-orange',
		role: '專案經理',
		period: '2025/5 – 2025/9',
		bullets: [
			{
				text: '負責電商平台產品規劃與功能優化，主導數據儀表板開發，整合銷售與庫存數據，取代人工報表並建立系統化營運管理機制。',
			},
			{
				text: '帶領 3 人團隊導入數據驅動決策，以銷售分析與預測作為進貨模式與銷售策略的依據，降低庫存壓力並提升預測準確度。',
			},
			{
				text: '主導 Amazon AU 與 Walmart CA 新市場進入，透過市場規模、競品定價與消費者評價分析找出市場缺口，建立差異化定位，成功導入 20 項產品。',
			},
			{
				text: '比較各通路的流量結構、費用模式與物流條件，排定上架優先順序，並依當地消費者回饋調整產品組合、定價與商品文案。',
			},
		],
	},
	{
		company: '麻古茶坊 Macu Tea',
		logo: 'macu-tea',
		role: '軟體工程師',
		period: '2023/8 – 2025/4',
		intro: '以 React + MUI + TypeScript 同時開發兩個跨瀏覽器 PWA 響應式內部系統及負責資料整合：',
		bullets: [
			{
				label: '營運管理系統，服務超過 500 名用戶',
				short: '營運管理系統',
				children: [
					{ label: '物料訂購系統', text: '讓門市人員線上下單並即時查看訂單狀態。' },
					{
						label: '每日營業報表',
						text: '以 Node.js 每日從本地 SQL 伺服器抓取 350+ 家門店銷售數據約 30 萬筆資料並傳送至 AWS，前端以 GraphQL 取得資料並支援匯出 Excel 檔。',
					},
					{
						label: '配送表',
						text: '建立 API 接收 POS 商 Webhook 事件並存至 DynamoDB，串接 Uber API 管理配送，統整成配送表供管理者分析比較。',
					},
					{
						label: '公告系統',
						text: '公告存於 DynamoDB、附件存於 S3，並追蹤已讀狀態控制通知顯示。',
					},
				],
			},
			{
				label: '海外訂單及庫存管理系統，提供海外員工及業主使用',
				short: '海外訂單及庫存管理系統',
				children: [
					{
						text: '建立物料清單與訂單儀表板，支援多條件篩選與查找訂單；使用者下單或更新訂單時觸發 Lambda function 自動寄送 Excel 通知信。',
					},
					{
						label: '效能優化',
						text: '以 GraphQL nextToken 分頁分批載入資料，降低單次請求負載並提升效能。',
					},
					{
						label: '狀態同步',
						text: '透過 GraphQL Mutation 更新與追蹤訂單狀態，確保內外部資訊同步。',
					},
					{
						label: '多語系',
						text: '透過 i18n 實作中英雙語切換，提供海外使用者在地化介面。',
					},
				],
			},
			{
				label: 'API 與監控',
				text: '透過 API Gateway 串接 RESTful API，並以 CloudWatch 監控系統運作。',
			},
			{
				label: 'Grafana 數據表',
				text: '串接 SQL 伺服器建立全台 350 家門店銷售報表，供經理產出每週報告。',
			},
		],
	},
	{
		company: 'Hour Loop',
		companyNote: '(NASDAQ: Hour)',
		logo: 'hour-loop',
		role: '軟體工程師',
		period: '2023/3 – 2023/8',
		intro: '三個月內已完成 5 項新功能、優化 10 項現有功能及使用者介面，使用 Ruby on Rails 搭配 Bootstrap 來搭建，成功幫助財務、業務部門及主管單位更有效的作業。',
		bullets: [
			{
				label: '跨部門團隊合作',
				text: '開發和維護用於線上零售業務的軟體應用程式，有助於提升公司業務效率和盈利能力。',
			},
			{
				label: '提供業務部門優化及解決問題方案',
				short: '業務優化方案',
				text: '了解他們的需求並將其轉化為技術規格，開發解決方案及設計符合使用者的功能。',
			},
		],
	},
	{
		company: 'Hour Loop',
		companyNote: '(NASDAQ: Hour)',
		logo: 'hour-loop',
		role: 'Business Manager → Senior Business Manager',
		period: '2018 – 2023/3',
		intro: '跨境電商營運管理',
		bullets: [
			{
				label: '2021-2022 採購年成長為 75%，2022 年採購為 470 萬美元。',
				short: '2022 年採購 470 萬美元',
				children: [
					{
						label: '每月績效分析',
						text: '分析整體銷售數據、訂定合理的採購計畫並提供解決方案。',
					},
					{
						label: '識別關鍵績效數據',
						text: '透過追蹤銷售採購進度，進而評估市場行銷活動及銷售計劃的有效性，並提供應對措施。',
					},
					{
						label: '市場研究和競爭者分析',
						text: '辨別趨勢和機會以制定能提升營業額的市場營銷策略。',
					},
				],
			},
			{
				label: '2020-2021 的淨利年成長為 86%，2021 年採購為 270 萬美元。',
				short: '2021 年淨利年成長 86%',
				children: [
					{
						label: '商業談判技巧',
						text: '獲得有利的合作協議及年度折扣，從而節省成本並提升獲利。',
					},
					{
						label: '管理和維護供應商關係',
						text: '積極維護長期合作夥伴關係，通過有效溝通和談判的策略，確保雙方互惠互利，一起推動業務增長的規劃。',
					},
					{
						label: '策略評估',
						text: '運用策略來提升採購金額，以利於鞏固與供應商之間的合夥關係與信任。',
					},
				],
			},
		],
	},
];

export const skills = [
	{
		label: '前端',
		items: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'MUI', 'Redux Toolkit', 'Figma'],
	},
	{ label: '後端 / 資料庫', items: ['Node.js', 'GraphQL', 'PostgreSQL', 'MS SQL', 'MySQL'] },
	{
		label: '雲端 / DevOps',
		items: ['AWS', 'Cloudflare', 'Kubernetes', 'Rancher', 'Argo CD', 'Jenkins'],
	},
	{
		label: '工具 / 版控',
		items: ['Git', 'GitHub', 'SourceTree', 'Visual Studio', 'Postman', 'Grafana', 'Bitbucket'],
	},
	{ label: 'AI 輔助開發工具', items: ['Claude Code', 'Cursor'] },
];

export const education = [
	{
		period: '2014 – 2018',
		school: '東吳大學',
		schoolEn: 'Soochow University',
		detail: '企業管理學系',
	},
	{ period: '2017 – 2018', school: 'Wesleyan College', detail: '交換學生' },
];

export const certifications = [
	{ name: '網頁資料擷取與分析', issuer: 'TQC' },
	{ name: '程式語言', issuer: 'TQC' },
];

export const languages = [{ name: '英文', level: '精通' }];
