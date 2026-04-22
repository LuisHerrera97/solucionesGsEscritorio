import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import type { ConfiguracionSistemaDto } from '../../../../../domain/general/types';
import { getErrorMessage } from '../../../../../infrastructure/utils/getErrorMessage';
import {
  asNumber,
  coalesceEmptyNumbersToZero,
  numberInputDisplay,
  parseNumberInput,
  type WithEmptyNumberFields,
} from '../../../../../infrastructure/utils/numberInput';
import { useActualizarConfiguracionSistemaMutation } from '../../hooks/generalHooks';
import { useAuth } from '../../../auth/context/useAuth';

export const ConfiguracionSistemaForm = ({ initial }: { initial: ConfiguracionSistemaDto }) => {
  const [formData, setFormData] = useState<WithEmptyNumberFields<ConfiguracionSistemaDto>>(initial);
  const updateMutation = useActualizarConfiguracionSistemaMutation();
  const { canBoton } = useAuth();
  const canEditar = canBoton('CONFIGURACION_EDITAR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await updateMutation.mutateAsync(coalesceEmptyNumbersToZero(formData) as ConfiguracionSistemaDto);
      toast.success('Configuración guardada');
      setFormData(data);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible guardar la configuración'));
    }
  };

  const loading = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configuración Diaria */}
        <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-primaryBlue uppercase tracking-wider">Créditos Diarios</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mora ($/día)</label>
              <input
                type="number"
                min={0}
                value={numberInputDisplay(formData.moraDiaria)}
                onChange={(e) => setFormData((prev) => ({ ...prev, moraDiaria: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Días gracia</label>
                <input
                  type="number"
                  min={0}
                  value={numberInputDisplay(formData.diasGraciaDiaria)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diasGraciaDiaria: parseNumberInput(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tope mora (veces)</label>
                <input
                  type="number"
                  min={0}
                  value={numberInputDisplay(formData.topeMoraDiaria)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, topeMoraDiaria: parseNumberInput(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                  disabled={loading}
                />
              </div>
            </div>
            <p className="text-xs text-infoBlue font-medium">
              {asNumber(formData.diasGraciaDiaria) === 0
                ? 'La mora se aplica inmediatamente al día siguiente del vencimiento.'
                : `La mora se aplica a partir del ${asNumber(formData.diasGraciaDiaria) + 1}.º día de atraso.`}
            </p>
          </div>
        </div>

        {/* Configuración Semanal */}
        <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-primaryBlue uppercase tracking-wider">Créditos Semanales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mora ($/día)</label>
              <input
                type="number"
                min={0}
                value={numberInputDisplay(formData.moraSemanal)}
                onChange={(e) => setFormData((prev) => ({ ...prev, moraSemanal: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Días gracia</label>
                <input
                  type="number"
                  min={0}
                  value={numberInputDisplay(formData.diasGraciaSemanal)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diasGraciaSemanal: parseNumberInput(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tope mora (veces)</label>
                <input
                  type="number"
                  min={0}
                  value={numberInputDisplay(formData.topeMoraSemanal)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, topeMoraSemanal: parseNumberInput(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                  disabled={loading}
                />
              </div>
            </div>
            <p className="text-xs text-infoBlue font-medium">
              {asNumber(formData.diasGraciaSemanal) === 0
                ? 'La mora se aplica inmediatamente al día siguiente del vencimiento.'
                : `La mora se aplica a partir del ${asNumber(formData.diasGraciaSemanal) + 1}.º día de atraso.`}
            </p>
          </div>
        </div>

        {/* Configuración Mensual */}
        <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-primaryBlue uppercase tracking-wider">Créditos Mensuales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mora ($/periodo)</label>
              <input
                type="number"
                min={0}
                value={numberInputDisplay(formData.moraMensual)}
                onChange={(e) => setFormData((prev) => ({ ...prev, moraMensual: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Días gracia</label>
                <input
                  type="number"
                  min={0}
                  value={numberInputDisplay(formData.diasGraciaMensual)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diasGraciaMensual: parseNumberInput(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tope mora (veces)</label>
                <input
                  type="number"
                  min={0}
                  value={numberInputDisplay(formData.topeMoraMensual)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, topeMoraMensual: parseNumberInput(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                  disabled={loading}
                />
              </div>
            </div>
            <p className="text-xs text-infoBlue font-medium">
              {asNumber(formData.diasGraciaMensual) === 0
                ? 'La mora se aplica inmediatamente al día siguiente del vencimiento.'
                : `La mora se aplica a partir del ${asNumber(formData.diasGraciaMensual) + 1}.º día de atraso.`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Intereses */}
        <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Tasas de Interés</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tasa Diaria (%)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={numberInputDisplay(formData.tasaDiaria)}
                onChange={(e) => setFormData((prev) => ({ ...prev, tasaDiaria: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tasa Semanal (%)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={numberInputDisplay(formData.tasaSemanal)}
                onChange={(e) => setFormData((prev) => ({ ...prev, tasaSemanal: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tasa Mensual (%)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={numberInputDisplay(formData.tasaMensual)}
                onChange={(e) => setFormData((prev) => ({ ...prev, tasaMensual: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Calendario</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.domingoInhabilDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, domingoInhabilDefault: e.target.checked }))}
                disabled={loading}
              />
              Domingo inhábil por defecto (créditos diarios)
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.aplicarFeriadosDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, aplicarFeriadosDefault: e.target.checked }))}
                disabled={loading}
              />
              Aplicar feriados por defecto
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Política de Seguridad y Contraseñas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitud mínima</label>
              <input
                type="number"
                min={6}
                value={numberInputDisplay(formData.passwordMinLength)}
                onChange={(e) => setFormData((prev) => ({ ...prev, passwordMinLength: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expira (días)</label>
              <input
                type="number"
                min={0}
                value={numberInputDisplay(formData.passwordExpireDays)}
                onChange={(e) => setFormData((prev) => ({ ...prev, passwordExpireDays: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Historial (N)</label>
              <input
                type="number"
                min={0}
                value={numberInputDisplay(formData.passwordHistoryCount)}
                onChange={(e) => setFormData((prev) => ({ ...prev, passwordHistoryCount: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bloqueo (min)</label>
              <input
                type="number"
                min={0}
                value={numberInputDisplay(formData.lockoutMinutes)}
                onChange={(e) => setFormData((prev) => ({ ...prev, lockoutMinutes: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 text-sm text-textDark cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.passwordRequireUpper}
                onChange={(e) => setFormData((prev) => ({ ...prev, passwordRequireUpper: e.target.checked }))}
                disabled={loading}
              />
              Mayúscula
            </label>
            <label className="flex items-center gap-2 text-sm text-textDark cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.passwordRequireLower}
                onChange={(e) => setFormData((prev) => ({ ...prev, passwordRequireLower: e.target.checked }))}
                disabled={loading}
              />
              Minúscula
            </label>
            <label className="flex items-center gap-2 text-sm text-textDark cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.passwordRequireDigit}
                onChange={(e) => setFormData((prev) => ({ ...prev, passwordRequireDigit: e.target.checked }))}
                disabled={loading}
              />
              Número
            </label>
            <label className="flex items-center gap-2 text-sm text-textDark cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.passwordRequireSpecial}
                onChange={(e) => setFormData((prev) => ({ ...prev, passwordRequireSpecial: e.target.checked }))}
                disabled={loading}
              />
              Especial
            </label>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Intentos máximos permitidos</label>
            <input
              type="number"
              min={0}
              value={numberInputDisplay(formData.lockoutMaxFailedAttempts)}
              onChange={(e) => setFormData((prev) => ({ ...prev, lockoutMaxFailedAttempts: parseNumberInput(e.target.value) }))}
              className="w-full md:w-1/4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-primaryBlue hover:bg-primaryBlueDark text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors font-bold shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!canEditar || loading}
        >
          <Save size={20} />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};
