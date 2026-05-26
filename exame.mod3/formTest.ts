import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { createFormAdd } from './form.add';
import type { Product } from '../types/product';

describe('createFormAdd', () => {
    const existingProducts: Product[] = [
        {
            id: 1,
            name: 'Product 1',
            description: 'desc 1',
            category: 'mobile',
            price: 100,
            hasPromo: false,
        },
        {
            id: 5,
            name: 'Product 5',
            description: 'desc 5',
            category: 'computer',
            price: 500,
            hasPromo: true,
        },
    ];

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    describe('Rendering', () => {
        let form: HTMLFormElement;

        beforeEach(() => {
            form = createFormAdd(existingProducts);
        });

        it('should render a <form> element with proper aria-label', () => {
            expect(form).toBeInTheDocument();
            expect(form.tagName).toBe('FORM');
            expect(form).toHaveAttribute('aria-label', 'add_form');
            expect(form).toHaveClass('add_form');
        });

        it('should render a text input for the name', () => {
            const nameInput = form.querySelector(
                'input[name="name"]',
            ) as HTMLInputElement;
            expect(nameInput).toBeInTheDocument();
            expect(nameInput.type).toBe('text');
        });

        it('should render a text input for the description', () => {
            const descInput = form.querySelector(
                'input[name="description"]',
            ) as HTMLInputElement;
            expect(descInput).toBeInTheDocument();
            expect(descInput.type).toBe('text');
        });

        it('should render a number input for the price', () => {
            const priceInput = form.querySelector(
                'input[name="price"]',
            ) as HTMLInputElement;
            expect(priceInput).toBeInTheDocument();
            expect(priceInput.type).toBe('number');
        });

        it('should render a checkbox for hasPromo', () => {
            const promoInput = form.querySelector(
                'input[name="hasPromo"]',
            ) as HTMLInputElement;
            expect(promoInput).toBeInTheDocument();
            expect(promoInput.type).toBe('checkbox');
        });

        it('should render a select with the 4 categories', () => {
            const select = form.querySelector(
                'select[name="category"]',
            ) as HTMLSelectElement;
            expect(select).toBeInTheDocument();

            const options = select.querySelectorAll('option:not([disabled])');
            const values = Array.from(options).map(
                (opt) => (opt as HTMLOptionElement).value,
            );
            expect(values).toEqual([
                'mobile',
                'computer',
                'screen',
                'components',
            ]);
        });

        it('should render a submit button with text "Crear"', () => {
            const button = screen.getByRole('button', { name: /crear/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('type', 'submit');
        });
    });

    describe('Form submission', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should prevent the default submit behavior', async () => {
            const form = createFormAdd(existingProducts);
            const submitEvent = new Event('submit', {
                cancelable: true,
                bubbles: true,
            });
            const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

            form.dispatchEvent(submitEvent);

            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('should log the form data as a Product when submitted', async () => {
            const user = userEvent.setup();
            const form = createFormAdd(existingProducts);

            await user.type(
                form.querySelector('input[name="name"]') as HTMLInputElement,
                'New Phone',
            );
            await user.type(
                form.querySelector(
                    'input[name="description"]',
                ) as HTMLInputElement,
                'Latest model',
            );
            await user.type(
                form.querySelector('input[name="price"]') as HTMLInputElement,
                '999',
            );
            await user.click(
                form.querySelector(
                    'input[name="hasPromo"]',
                ) as HTMLInputElement,
            );
            await user.selectOptions(
                form.querySelector(
                    'select[name="category"]',
                ) as HTMLSelectElement,
                'mobile',
            );

            const button = screen.getByRole('button', { name: /crear/i });
            await user.click(button);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Form submitted:',
                expect.objectContaining({
                    id: 6,
                    name: 'New Phone',
                    description: 'Latest model',
                    category: 'mobile',
                    price: 999,
                    hasPromo: true,
                }),
            );
        });

        it('should generate id based on existing products (max id + 1)', async () => {
            const user = userEvent.setup();
            const products: Product[] = [
                { ...existingProducts[0], id: 10 },
                { ...existingProducts[1], id: 25 },
            ];
            const form = createFormAdd(products);

            await user.type(
                form.querySelector('input[name="name"]') as HTMLInputElement,
                'X',
            );
            await user.type(
                form.querySelector('input[name="price"]') as HTMLInputElement,
                '1',
            );

            const button = screen.getByRole('button', { name: /crear/i });
            await user.click(button);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Form submitted:',
                expect.objectContaining({ id: 26 }),
            );
        });

        it('should set hasPromo to false when checkbox is not checked', async () => {
            const user = userEvent.setup();
            const form = createFormAdd(existingProducts);

            await user.type(
                form.querySelector('input[name="name"]') as HTMLInputElement,
                'No Promo',
            );
            await user.type(
                form.querySelector('input[name="price"]') as HTMLInputElement,
                '50',
            );

            const button = screen.getByRole('button', { name: /crear/i });
            await user.click(button);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Form submitted:',
                expect.objectContaining({ hasPromo: false }),
            );
        });
    });
});
