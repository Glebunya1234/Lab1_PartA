let protocol: string = "";

function parseMatrix(text: string): number[][] {
    return text
        .trim()
        .split("\n")
        .map(row => row.trim().split(/\s+/).map(Number));
}

function formatMatrix(m: number[][]): string {
    return m.map(r => r.map(x =>
        (Math.abs(x) < 1e-10 ? "0,00" : x.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    ).join("\t")).join("\n");
}

function jordanStep(matrix: number[][], r: number, s: number): number[][] {
    const n = matrix.length;
    const m = matrix[0].length;
    const pivot = matrix[r][s];

    if (Math.abs(pivot) < 1e-10) return matrix;

    const result: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (i === r && j === s) {
                result[i][j] = 1 / pivot;
            } else if (i === r) {
                result[i][j] = -matrix[r][j] / pivot;
            } else if (j === s) {
                result[i][j] = matrix[i][s] / pivot;
            } else {
                result[i][j] = matrix[i][j] - (matrix[i][s] * matrix[r][j]) / pivot;
            }
        }
    }

    protocol += `\nКрок #${r + 1}\n\nРозв'язувальний елемент: А[${r + 1}, ${s + 1}] = ${pivot.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}\n\n`;
    protocol += `Матриця після виконання ЗЖВ:\n${formatMatrix(result)}\n`;

    return result;
}

function calcInverse() {
    protocol = "";
    const A = parseMatrix((document.getElementById("matrixA") as HTMLTextAreaElement).value);

    const n = A.length;
    const m = A[0].length;


    if (n !== m) {
        alert("Помилка: Знайти обернену матрицю можна тільки для квадратної матриці!");
        return;
    }

    protocol += "Знаходження оберненої матриці:\n\nВхідна матриця:\n";
    protocol += formatMatrix(A) + "\n\nПротокол обчислення:\n";

    let res = A.map(row => [...row]);
    for (let i = 0; i < n; i++) {
        res = jordanStep(res, i, i);
    }

    protocol += "\nОбернена матриця:\n" + formatMatrix(res);
    document.getElementById("output")!.textContent = protocol;
}

function calcRank() {
    protocol = "";
    const A = parseMatrix((document.getElementById("matrixA") as HTMLTextAreaElement).value);


    let res = A.map(row => [...row]);
    const rows = res.length;
    const cols = res[0].length;
    let rank = 0;

    for (let i = 0; i < Math.min(rows, cols); i++) {
        if (Math.abs(res[i][i]) > 1e-10) {
            res = jordanStep(res, i, i);
            rank++;
        }
    }

    protocol += `\nРанг матриці: ${rank}`;
    document.getElementById("output")!.textContent = protocol;
}

function calcSolve() {
    protocol = "";
    const matrixA_val = (document.getElementById("matrixA") as HTMLTextAreaElement).value;
    const matrixB_val = (document.getElementById("matrixB") as HTMLTextAreaElement).value;

    const A = parseMatrix(matrixA_val);
    const B = parseMatrix(matrixB_val);

    if (A.length !== A[0].length) {
        alert("Помилка: СЛАР має мати квадратну матрицю коефіцієнтів для цього методу!");
        return;
    }

    protocol += "Знаходження розв'язків СЛАР 1-м методом (за допомогою оберненої матриці):\n\n";
    protocol += "Знаходження оберненої матриці:\n\nВхідна матриця:\n";
    protocol += formatMatrix(A) + "\n\nПротокол обчислення:\n";

    let inv = A.map(row => [...row]);
    for (let i = 0; i < inv.length; i++) {
        inv = jordanStep(inv, i, i);
    }

    protocol += "\nОбернена матриця:\n" + formatMatrix(inv) + "\n\n";
    protocol += "Вхідна матриця В:\n" + formatMatrix(B) + "\n\n";

    protocol += "Обчислення розв'язків:\n\n";

    const n = inv.length;
    for (let i = 0; i < n; i++) {
        let sum = 0;
        let terms: string[] = [];

        for (let j = 0; j < n; j++) {
            const valInv = inv[i][j];
            const valB = B[j][0];
            sum += valInv * valB;

            const bStr = valB.toLocaleString('uk-UA', { minimumFractionDigits: 2 });
            const invStr = valInv.toLocaleString('uk-UA', { minimumFractionDigits: 2 });
            const invLabel = valInv >= 0 ? invStr : `(${invStr})`;

            terms.push(`${bStr} * ${invLabel}`);
        }

        protocol += `X[${i + 1}] = ${terms.join(" + ")} = ${sum.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}\n`;
    }

    document.getElementById("output")!.textContent = protocol;
}