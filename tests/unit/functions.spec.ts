import { shorten } from "@/utils/functions";

describe('function shorten', () => {
    test.each([
        ['', 5, ''],
        ['123456', 5, '12345...'],
        ['123', 5, '123'],
        ['12', 5, '12'],
        ['1234', 5, '1234'],
        ['12345', 5, '12345'],
        ['123456', 0, '...'],
        ['......', 5, '........'],
    ])('shortens "%s" to "%s"', (str, len, expected) => {
        expect(shorten(str, len)).toBe(expected);
    });
})