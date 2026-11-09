<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'state' => [
                'required',
                'string',
                Rule::in([
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
                ]),
            ],
            'subject' => [
                'required',
                'string',
                Rule::in([
                    'Solicitar cotización',
                    'Información de productos',
                    'Consultar sucursales y cobertura',
                    'Pedidos y entregas',
                    'Atención al cliente',
                    'Otro asunto',
                ]),
            ],
            'message' => ['required', 'string', 'max:3000'],
            'privacy_accepted' => ['required', 'accepted'],
        ];
    }
}
