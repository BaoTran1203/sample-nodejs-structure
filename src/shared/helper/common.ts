export class Common {
	/**
     * Chuyển đổi thời gian kiểu String sang Timestamp
     * @param str
     * @returns {number}
     */
    static strToTime(str: string): number {
        if (!str) {
            return Date.now();
        }

        return Math.round(new Date(str).getTime())
    }
}