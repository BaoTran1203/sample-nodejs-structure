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

    /**
     * Generate mã code (tối thiểu 4 kí tự)
     * @param length 
     */
    static generateCode(length: number = 4): string {
        if (length < 4) {
            length = 4;
        }

        let code = '';
        for (let i = 0; i < length; i++) {
            code += this.rand(0, 9);
        }
        return code;
    }

    /**
     * Tạo ngẫu nhiên một số
     * @param min 
     * @param max 
     */
    static rand(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}