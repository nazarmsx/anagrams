import { findAnagrams,sortString } from '../src/util';
import { describe, expect, it } from '@jest/globals';

describe('should find anagrams', () => {
    it('should sort string',  () => {
        const input = 'dbcza';
        expect(sortString(input)).toEqual('abcdz')
    });

    it('should group anagrams',  () => {
        const input = ['abc', 'bac','cab', 'df'];
        const anagrams = [...findAnagrams(input).get('abc').values()];
        expect(anagrams).toHaveLength(3)
    });

    it('strings in group should be anagrams',  () => {
        const input = ['abc', 'bac','cab', 'df'];
        const anagrams = [...findAnagrams(input).get('abc').values()];
        expect(sortString(anagrams[0])).toEqual(sortString(anagrams[1]))
    });
});

