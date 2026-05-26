import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ApiRepo } from './api.repo';
import type { Product } from '../types/product';

describe('ApiRepo', () => {
    let repo: ApiRepo;
    const apiUrl = 'http://localhost:3000/products';

    const mockProduct: Product = {
        id: 1,
        name: 'Test',
        description: 'Test desc',
        category: 'mobile',
        price: 100,
        hasPromo: false,
    };

    beforeEach(() => {
        repo = new ApiRepo();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Instance', () => {
        it('should be an instance of ApiRepo with the correct apiUrl', () => {
            expect(repo).toBeInstanceOf(ApiRepo);
            expect(repo.apiUrl).toBe(apiUrl);
        });
    });

    describe('getProducts', () => {
        it('should call fetch with the apiUrl and return the list of products', async () => {
            const products = [mockProduct];
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(products),
            });

            const result = await repo.getProducts();

            expect(global.fetch).toHaveBeenCalledWith(apiUrl);
            expect(result).toEqual(products);
        });

        it('should throw an error when response is not ok', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

            await expect(repo.getProducts()).rejects.toThrow(
                '500 Internal Server Error',
            );
        });
    });

    describe('createProduct', () => {
        const newProduct: Partial<Product> = {
            name: 'New',
            price: 200,
            category: 'mobile',
        };

        it('should call fetch with POST and return the created product', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockProduct),
            });

            const result = await repo.createProduct(newProduct);

            expect(global.fetch).toHaveBeenCalledWith(apiUrl, {
                method: 'POST',
                body: JSON.stringify(newProduct),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            expect(result).toEqual(mockProduct);
        });

        it('should throw an error when response is not ok', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
            });

            await expect(repo.createProduct(newProduct)).rejects.toThrow(
                '400 Bad Request',
            );
        });
    });

    describe('updateProduct', () => {
        const updatedFields: Partial<Product> = { price: 999 };

        it('should call fetch with PATCH and the proper URL, then return the updated product', async () => {
            const updatedProduct = { ...mockProduct, price: 999 };
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(updatedProduct),
            });

            const result = await repo.updateProduct(1, updatedFields);

            expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/1`, {
                method: 'PATCH',
                body: JSON.stringify(updatedFields),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            expect(result).toEqual(updatedProduct);
        });

        it('should throw an error when response is not ok', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            await expect(
                repo.updateProduct(99, updatedFields),
            ).rejects.toThrow('404 Not Found');
        });
    });

    describe('deleteProduct', () => {
        it('should call fetch with DELETE and the proper URL, then return the result', async () => {
            const remaining: Product[] = [];
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(remaining),
            });

            const result = await repo.deleteProduct(1);

            expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/1`, {
                method: 'DELETE',
            });
            expect(result).toEqual(remaining);
        });

        it('should throw an error when response is not ok', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            await expect(repo.deleteProduct(99)).rejects.toThrow(
                '404 Not Found',
            );
        });
    });
});
