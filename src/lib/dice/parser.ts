/**
 * Parser para expressões de rolagem de dados
 * Suporta: XdY, XdY! (explosivo), +/-, múltiplos dados
 *
 * Exemplos:
 *   2d6      → 2 dados de 6 faces
 *   1d20+5   → 1d20 + 5
 *   4d6!     → 4d6 com explosão (rerola 6s)
 *   2d6+1d8+3 → múltiplos grupos
 */

export interface ParsedDie {
	die: number; // número de faces
	count: number; // quantidade de dados
	explosive: boolean; // se é explosivo (XdY!)
}

export interface ParsedRoll {
	dice: ParsedDie[];
	modifier: number; // valor fixo somado/subtraído
	expression: string; // expressão original
}

export interface ParseError {
	message: string;
	position: number;
}

/**
 * Tokeniza a expressão em partes
 */
function tokenize(expr: string): string[] {
	const tokens: string[] = [];
	let current = "";

	for (let i = 0; i < expr.length; i++) {
		const char = expr[i];

		if (char === " " && current.trim()) {
			tokens.push(current.trim());
			current = "";
		} else if ("+-".includes(char) && current && !/[0-9d]/.test(current[current.length - 1]?.toLowerCase() ?? "")) {
			// É um modificador, não parte de um número
			if (current.trim()) tokens.push(current.trim());
			tokens.push(char);
			current = "";
		} else {
			current += char;
		}
	}

	if (current.trim()) tokens.push(current.trim());
	return tokens.filter(Boolean);
}

/**
 * Valida se um número é uma face de dado válida
 */
function isValidDieSize(size: number): boolean {
	return [4, 6, 8, 10, 12, 20, 100].includes(size);
}

/**
 * Converte um token como "2d6" ou "d20" em ParsedDie
 */
function parseDieToken(token: string): ParsedDie {
	const match = token.match(/^(\d*)d(\d+)(!)?$/i);

	if (!match) {
		throw new Error(`Token inválido: ${token}`);
	}

	const count = match[1] ? parseInt(match[1], 10) : 1;
	const die = parseInt(match[2], 10);
	const explosive = match[3] === "!";

	if (!isValidDieSize(die)) {
		throw new Error(`Tamanho de dado inválido: d${die}`);
	}

	if (count < 1 || count > 20) {
		throw new Error(`Quantidade de dados inválida: ${count}`);
	}

	return { die, count, explosive };
}

/**
 * Converte um token de modificador em número
 */
function parseModifierToken(token: string): number {
	const value = parseInt(token.replace(/[+-]/g, ""), 10);
	if (isNaN(value)) {
		throw new Error(`Modificador inválido: ${token}`);
	}
	return token.startsWith("-") ? -value : value;
}

/**
 * Parseia uma expressão de rolagem
 */
export function parseRollExpression(expression: string): ParsedRoll {
	const trimmed = expression.trim().toLowerCase();

	if (!trimmed) {
		throw new Error("Expressão vazia");
	}

	const tokens = tokenize(trimmed);
	const dice: ParsedDie[] = [];
	let modifier = 0;

	for (const token of tokens) {
		if (token.match(/^\d*d\d+/i)) {
			// É um token de dado (ex: 2d6, d20, 4d6!)
			dice.push(parseDieToken(token));
		} else if (token.match(/^[+-]?\d+$/)) {
			// É um modificador numérico
			modifier += parseModifierToken(token);
		} else if (token === "+" || token === "-") {
			// É apenas um operador, o próximo token deve ser o valor
			continue;
		} else {
			throw new Error(`Token desconhecido: ${token}`);
		}
	}

	if (dice.length === 0) {
		throw new Error("Nenhum dado encontrado na expressão");
	}

	return {
		dice,
		modifier,
		expression: trimmed,
	};
}

/**
 * Valida uma expressão sem fazer parse completo
 */
export function validateExpression(expression: string): ParseError | null {
	try {
		parseRollExpression(expression);
		return null;
	} catch (e) {
		return {
			message: e instanceof Error ? e.message : "Erro desconhecido",
			position: 0,
		};
	}
}
