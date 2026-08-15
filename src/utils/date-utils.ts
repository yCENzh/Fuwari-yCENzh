/**
 * 格式化日期为 YYYY-MM-DD 格式（使用本地时间，与 formatDateToMMDD 保持一致）
 */
export function formatDateToYYYYMMDD(date: Date): string {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * 格式化日期为 MM-DD 格式（用于归档面板等）
 */
export function formatDateToMMDD(date: Date): string {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}
