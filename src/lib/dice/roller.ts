/**
 * Motor de rolagem de dados
 */

import { parseRollExpression, type ParsedDie, type ParsedRoll } from "./parser";

export interface DieRoll {
	die: number; // faces do dado
	value: number; // valor rolado
	exploded: boolean; // se foi explosão
}

export interface RollResult {
	expression: string;
	total: number;
	dice: DieRoll[];
	modifier: number;
	createdAt: Date;
}

/**
 * Rola um único dado com possibilidade de explosão
 */
function rollSingleDie(faces: number, explosive: boolean): DieRoll {
	let value = Math.floor(Math.random() * faces) + 1;
	let exploded = false;

	if (explosive) {
		const rolls: number[] = [value];
		while (value === faces) {
			value = Math.floor(Math.random() * faces) + 1;
			rolls.push(value);
			exploded = true;
		}
		// Retorna o primeiro valor que não foi explosão, mas marca como explosivo se houve alguma
		value = rolls[0];
	}

	return { die: faces, value, exploded };
}

/**
 * Rola um ParsedDie e retorna os resultados
 */
function rollDice(parsed: ParsedDie): DieRoll[] {
	const results: DieRoll[] = [];

	for (let i = 0; i < parsed.count; i++) {
		const roll = rollSingleDie(parsed.die, parsed.explosive);
		results.push(roll);

		// Se explosivo, continua rolando enquanto tirar faces máximas
		if (parsed.explosive) {
			while (roll.value === parsed.die) {
				const explosion = rollSingleDie(parsed.die, true);
				explosion.exploded = true;
				results.push(explosion);
				if (!explosion.exploded) break;
			}
		}
	}

	return results;
}

/**
 * Executa uma rolagem a partir de uma expressão
 */
export function roll(expression: string): RollResult {
	const parsed = parseRollExpression(expression);

	let total = parsed.modifier;
	const dice: DieRoll[] = [];

	for (const dieGroup of parsed.dice) {
		const rolls = rollDice(dieGroup);
		dice.push(...rolls);

		const sum = rolls.reduce((acc, r) => acc + r.value, 0);
		total += sum;
	}

	return {
		expression: parsed.expression,
		total,
		dice,
		modifier: parsed.modifier,
		createdAt: new Date(),
	};
}

/**
 * Formata o resultado para exibição
 * Ex: "2d6+3 → [4][2]+3 = 9"
 */
export function formatRollResult(result: RollResult): string {
	const diceStr = result.dice.map((d) => `[${d.value}]`).join("");
	const modStr = result.modifier !== 0
		? (result.modifier > 0 ? `+${result.modifier}` : `${result.modifier}`)
		: "";

	return `${result.expression} → ${diceStr}${modStr} = ${result.total}`;
}

/**
 * Formata apenas os dados para display
 * Ex: "4 + 2 + 3"
 */
export function formatDiceValues(result: RollResult): string {
	return result.dice.map((d) => d.value).join(" + ");
}
