import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormInput, type LoginFormOutput } from '@/domain/auth/validations';
import { useLogin } from '@/domain/auth/hooks/useLogin';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { Checkbox } from '@/core/components/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';
import { LoadingSpinner } from '@/core/components/loading-spinner';

function LoginPage() {
  const { navigate } = useNavigation();
  const { login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormInput, any, LoginFormOutput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      senha: '',
      tipo_usuario: 'cliente',
      manter_conectado: false,
      metodo_autenticacao: 'direto',
    },
  });

  const onSubmit = async (data: LoginFormOutput) => {
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      // Error handled by hook
    }
  };

  const tipoUsuario = watch('tipo_usuario');
  const manterConectado = watch('manter_conectado');

  return (
    <div className="from-primary/5 via-background to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Bem-vindo</CardTitle>
          <CardDescription className="text-base">Entre na sua conta FaxinaJá</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tipo_usuario">Tipo de Usuário</Label>
              <Select
                value={tipoUsuario}
                onValueChange={(value) => setValue('tipo_usuario', value as any)}
              >
                <SelectTrigger id="tipo_usuario">
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_usuario && (
                <p className="text-destructive text-sm">{errors.tipo_usuario.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                {...register('senha')}
                aria-invalid={!!errors.senha}
              />
              {errors.senha && <p className="text-destructive text-sm">{errors.senha.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manter_conectado"
                  checked={manterConectado}
                  onCheckedChange={(checked) => setValue('manter_conectado', checked as boolean)}
                />
                <Label htmlFor="manter_conectado" className="cursor-pointer text-sm font-normal">
                  Manter conectado
                </Label>
              </div>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => navigate('/recuperar-senha')}
              >
                Esqueceu a senha?
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">Ou</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/cadastro-cliente')}
              >
                Cadastrar como Cliente
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/cadastro-profissional')}
              >
                Cadastrar como Profissional
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export { LoginPage };
