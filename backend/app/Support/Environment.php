<?php

namespace App\Support;

/**
 * Small helpers to read environment variables in a predictable way.
 *
 * These helpers are meant to be called from config/*.php files only, where
 * the environment is still the single source of truth. Reading the environment
 * from runtime code (controllers, services, ...) should be avoided because
 * `env()` returns null once the configuration is cached.
 */
final class Environment
{
    /**
     * Read a comma separated environment variable as a list of trimmed strings.
     *
     * When the variable is missing or empty the given default is returned, so
     * a configuration file always resolves to a complete, valid array.
     *
     * @param  array<int, string>  $default
     * @return array<int, string>
     */
    public static function csv(string $key, array $default = []): array
    {
        $value = env($key);

        if ($value === null || trim((string) $value) === '') {
            return array_values($default);
        }

        $items = array_map(
            static fn (string $item): string => trim($item),
            explode(',', (string) $value),
        );

        return array_values(array_filter(
            $items,
            static fn (string $item): bool => $item !== '',
        ));
    }

    /**
     * Read a boolean environment variable.
     */
    public static function boolean(string $key, bool $default = false): bool
    {
        $value = env($key);

        if ($value === null || trim((string) $value) === '') {
            return $default;
        }

        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? $default;
    }

    /**
     * Read an integer environment variable.
     */
    public static function integer(string $key, int $default = 0): int
    {
        $value = env($key);

        if ($value === null || trim((string) $value) === '') {
            return $default;
        }

        return (int) $value;
    }
}
