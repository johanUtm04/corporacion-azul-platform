<?php
/**
 * Plugin Name: CAZ Contact Bridge
 * Description: Secure contact integration between Laravel and WordPress.
 * Version: 0.1.0
 */

defined('ABSPATH') || exit;

add_action('rest_api_init', function () {

    register_rest_route('ca/v1', '/contact', [
        'methods' => 'POST',

        'permission_callback' => function (WP_REST_Request $request) {

            $expected = defined('CAZ_CONTACT_BRIDGE_TOKEN')
                ? CAZ_CONTACT_BRIDGE_TOKEN
                : '';

            $authorization = $request->get_header('authorization') ?? '';

            $provided = str_starts_with($authorization, 'Bearer ')
                ? substr($authorization, 7)
                : '';

            if (
                !is_string($expected) ||
                $expected === '' ||
                !hash_equals($expected, $provided)
            ) {
                return new WP_Error(
                    'caz_unauthorized',
                    'Unauthorized request.',
                    ['status' => 401]
                );
            }
            return true;
        },


        'callback' => function (WP_REST_Request $request) {

            $handler = \FluentForm\App\Services\Form\SubmissionHandlerService::class;

            if (!class_exists($handler)) {
                return new WP_Error(
                    'caz_fluent_unavailable',
                    'Fluent Forms is unavailable.',
                    ['status' => 503]
                );
            }

            $input = $request->get_json_params();

            $required = [
                'first_name', 'last_name', 'email',
                'phone', 'state', 'subject', 'message'
            ];

            foreach ($required as $field) {
                if (
                    !is_array($input) ||
                    !isset($input[$field]) ||
                    !is_string($input[$field]) ||
                    trim($input[$field]) === ''
                ) {
                    return new WP_Error(
                        'caz_invalid_input',
                        "Invalid or missing field: {$field}",
                        ['status' => 422]
                    );
                }
            }

            $limits = [
                'first_name' => 100,
                'last_name'  => 100,
                'email'      => 255,
                'phone'      => 30,
                'state'      => 100,
                'subject'    => 150,
                'message'    => 3000,
            ];

            $allowedSubjects = [
                'Solicitar cotización',
                'Información de productos',
                'Consultar sucursales y cobertura',
                'Pedidos y entregas',
                'Atención al cliente',
                'Otro asunto',
            ];

            $allowedStates = [
                'Aguascalientes',
                'Baja California',
                'Baja California Sur',
                'Campeche',
                'Chiapas',
                'Chihuahua',
                'Ciudad de México',
                'Coahuila',
                'Colima',
                'Durango',
                'Guanajuato',
                'Guerrero',
                'Hidalgo',
                'Jalisco',
                'Estado de México',
                'Michoacán',
                'Morelos',
                'Nayarit',
                'Nuevo León',
                'Oaxaca',
                'Puebla',
                'Querétaro',
                'Quintana Roo',
                'San Luis Potosí',
                'Sinaloa',
                'Sonora',
                'Tabasco',
                'Tamaulipas',
                'Tlaxcala',
                'Veracruz',
                'Yucatán',
                'Zacatecas',
            ];

            if (!in_array($input['state'], $allowedStates, true)) {
                return new WP_Error(
                    'caz_invalid_state',
                    'Invalid Mexican state.',
                    ['status' => 422]
                );
            }

            if (!in_array($input['subject'], $allowedSubjects, true)) {
                return new WP_Error(
                    'caz_invalid_subject',
                    'Invalid contact subject.',
                    ['status' => 422]
                );
            }

            foreach ($limits as $field => $maxLength) {
                if (mb_strlen($input[$field], 'UTF-8') > $maxLength) {
                    return new WP_Error(
                        'caz_field_too_long',
                        "Field exceeds maximum length: {$field}",
                        ['status' => 422]
                    );
                }
            }

            if (!is_email($input['email'])) {
                return new WP_Error(
                    'caz_invalid_email',
                    'Invalid email address.',
                    ['status' => 422]
                );
            }

            if (($input['privacy_accepted'] ?? false) !== true) {
                return new WP_Error(
                    'caz_privacy_required',
                    'Privacy consent is required.',
                    ['status' => 422]
                );
            }

            $data = [
                'names' => [
                    'first_name' => sanitize_text_field($input['first_name']),
                    'last_name'  => sanitize_text_field($input['last_name']),
                ],
                'email'         => sanitize_email($input['email']),
                'numeric_field' => sanitize_text_field($input['phone']),
                'dropdown'      => sanitize_text_field($input['state']),
                'dropdown_1'    => sanitize_text_field($input['subject']),
                'description'   => sanitize_textarea_field($input['message']),
                'checkbox'      => [
                    'He leído y acepto el Aviso de Privacidad.'
                ],
            ];

            try {
                $response = (new $handler())->handleSubmission($data, 3);

                if (empty($response['insert_id'])) {
                    return new WP_Error(
                        'caz_submission_failed',
                        'Submission was not confirmed.',
                        ['status' => 500]
                    );
                }

                return new WP_REST_Response([
                    'success' => true,
                    'entry_id' => (int) $response['insert_id'],
                ], 201);

            } catch (\FluentForm\Framework\Validator\ValidationException $e) {
                return new WP_REST_Response([
                    'success' => false,
                    'errors'  => $e->errors(),
                ], $e->getCode() === 429 ? 429 : 422);

            } catch (\Throwable $e) {
                return new WP_Error(
                    'caz_submission_error',
                    'An unexpected submission error occurred.',
                    ['status' => 500]
                );
            }
        }
    ]);
});