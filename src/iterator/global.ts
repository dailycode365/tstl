import { IForwardIterator } from "./IForwardIterator";
import { IBidirectionalIterator } from "./IBidirectionalIterator";
import { IRandomAccessIterator } from "./IRandomAccessIterator";

import { OutOfRange } from "../exception/LogicError";
import { _IEmpty, _ISize } from "../base/disposable/IPartialContainers";

/* =========================================================
	GLOBAL FUNCTIONS
		- ACCESSORS
		- MOVERS
		- FACTORIES
============================================================
	ACCESSORS
--------------------------------------------------------- */
/**
 * Test whether a container is empty.
 * 
 * @param source Target container.
 * @return Whether empty or not.
 */
export function empty(source: _IEmpty): boolean;

/**
 * @hidden
 */
export function empty<T>(source: Array<T>): boolean;
export function empty(source: any): boolean
{
	if (source instanceof Array)
		return source.length === 0;
	else
		return source.empty();
}

/**
 * Get number of elements of a container.
 * 
 * @param source Target container.
 * @return The number of elements in the container.
 */
export function size(source: _ISize): number

/**
 * @hidden
 */
export function size<T>(source: Array<T>): number;
export function size(source: any): number
{
	if (source instanceof Array)
		return source.length;
	else
		return source.size();
}

/**
 * Get distance between two iterators.
 * 
 * @param first Input iteartor of the first position.
 * @param last Input iterator of the last position.
 * 
 * @return The distance.
 */
export function distance<T, InputIterator extends IForwardIterator<T, InputIterator>>
	(first: InputIterator, last: InputIterator): number
{
	if ((<any>first).index !== undefined)
		return _Distance_via_index(<any>first, <any>last);

	let length: number = 0;
	for (; !first.equals(last); first = first.next())
		length++;

	return length;
}

/**
 * @hidden
 */
function _Distance_via_index<T, RandomAccessIterator extends IRandomAccessIterator<T, RandomAccessIterator>>
	(first: RandomAccessIterator, last: RandomAccessIterator): number
{
	let start: number = first.index();
	let end: number = last.index();

	if ((first as any).base instanceof Function)
		return start - end;
	else
		return end - start;	
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
/**
 * Advance iterator.
 * 
 * @param it Target iterator to advance.
 * @param n Step to advance.
 * 
 * @return The advanced iterator.
 */
export function advance<T, InputIterator extends IForwardIterator<T, InputIterator>>
	(it: InputIterator, n: number): InputIterator
{
	if ((<any>it).advance instanceof Function)
		it = (<any>it).advance(n);
	else if (n > 0)
		for (let i: number = 0; i < n; ++i)
			it = it.next();
	else
	{
		let p_it: IBidirectionalIterator<T, any> = <any>it;
		if (!(p_it.next instanceof Function))
			throw new OutOfRange("It's not bidirectional iterator. Advancing to negative value is impossible.");

		n = -n;
		for (let i: number = 0; i < n; ++i)
			p_it = p_it.prev();

		it = <any>p_it;
	}
	return it;
}

/**
 * Get previous iterator.
 * 
 * @param it Iterator to move.
 * @param n Step to move prev.
 * @return An iterator moved to prev *n* steps.
 */
export function prev<T, BidirectionalIterator extends IBidirectionalIterator<T, BidirectionalIterator>>
	(it: BidirectionalIterator, n: number = 1): BidirectionalIterator
{
	if (n === 1)
		return it.prev();
	else
		return advance(it, -n);
}

/**
 * Get next iterator.
 * 
 * @param it Iterator to move.
 * @param n Step to move next.
 * @return Iterator moved to next *n* steps.
 */
export function next<T, ForwardIterator extends IForwardIterator<T, ForwardIterator>>
	(it: ForwardIterator, n: number = 1): ForwardIterator
{	
	if (n === 1)
		return it.next();
	else
		return advance(it, n);
}

