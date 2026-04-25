let protocol = "";
function parseMatrix(text) {
    return text
        .trim()
        .split("\n")
        .map(row => row.trim().split(/\s+/).map(Number));
}
function formatMatrix(m) {
    return m.map(r => r.map(x => x.toFixed(2)).join(" ")).join("\n");
}
function jordanStep(matrix, r, s) {
    const n = matrix.length;
    const m = matrix[0].length;
    const pivot = matrix[r][s];
    protocol += `\nКрок #${r + 1}\n`;
    protocol += `Розв'язувальний елемент: A[${r + 1}, ${s + 1}] = ${pivot.toFixed(2)}\n\n`;
    const result = Array.from({ length: n }, () => Array(m).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (i === r && j === s) {
                result[i][j] = 1;
            }
            else if (i === r) {
                result[i][j] = matrix[i][j] / pivot;
            }
            else if (j === s) {
                result[i][j] = 0;
            }
            else {
                result[i][j] =
                    (matrix[i][j] * pivot - matrix[i][s] * matrix[r][j]) / pivot;
            }
        }
    }
    protocol += "Матриця після виконання ЗЖВ:\n";
    protocol += formatMatrix(result) + "\n";
    return result;
}
function jordanFull(matrix) {
    let res = matrix.map(r => [...r]);
    const n = res.length;
    protocol += "Протокол обчислення:\n";
    for (let i = 0; i < n; i++) {
        if (Math.abs(res[i][i]) < 1e-10)
            continue;
        res = jordanStep(res, i, i);
    }
    return res;
}
function calcInverse() {
    protocol = "";
    const A = parseMatrix(document.getElementById("matrixA").value);
    const n = A.length;
    protocol += "Знаходження оберненої матриці:\n\n";
    protocol += "Вхідна матриця:\n";
    protocol += formatMatrix(A) + "\n\n";
    const augmented = A.map((row, i) => [
        ...row,
        ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    ]);
    const res = jordanFull(augmented);
    const inverse = res.map(row => row.slice(n));
    protocol += "\nОбернена матриця:\n";
    protocol += formatMatrix(inverse);
    document.getElementById("output").textContent = protocol;
}
function calcRank() {
    protocol = "";
    const A = parseMatrix(document.getElementById("matrixA").value);
    const res = jordanFull(A);
    let rank = 0;
    for (const row of res) {
        if (row.some(x => Math.abs(x) > 1e-6))
            rank++;
    }
    protocol += "\nРанг матриці: " + rank;
    document.getElementById("output").textContent = protocol;
}
function calcSolve() {
    protocol = "";
    const A = parseMatrix(document.getElementById("matrixA").value);
    const B = parseMatrix(document.getElementById("matrixB").value);
    const n = A.length;
    protocol += "Розв'язання СЛАР 1-м методом:\n\n";
    const augmented = A.map((row, i) => [
        ...row,
        ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    ]);
    const res = jordanFull(augmented);
    const inv = res.map(row => row.slice(n));
    protocol += "\nВхідна матриця B:\n";
    protocol += formatMatrix(B) + "\n";
    const X = inv.map(row => row.reduce((sum, val, i) => sum + val * B[i][0], 0));
    protocol += "\nОбчислення розв'язків:\n";
    X.forEach((x, i) => {
        protocol += `X[${i + 1}] = ${x.toFixed(2)}\n`;
    });
    document.getElementById("output").textContent = protocol;
}
