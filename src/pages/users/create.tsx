import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query'
import { api } from "../../services/api";
import { queryClient } from "../../services/queryCliente";
import { useRouter } from "next/dist/client/router";

type CreateUserFormData = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }
  
  const createUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória').min(6, 'Minimo 6 caracteres'),
    password_confirmation: yup.string().oneOf([
        null, yup.ref('password')
    ],'As senhas precisam ser iguais')
  })
  
export default function CreateUser() {
    const router = useRouter();
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createUserFormSchema)
      });
    const createUser = useMutation(async (user: CreateUserFormData) => {
        const response = await api.post('users', {
            user: {
                ...user,
                created_at: new Date(),
            }
        })

        return response.data.user;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
        }
    })
    
      const { errors } = formState;

      const handleCreateUser: SubmitHandler<CreateUserFormData> = async(values) =>{
        await createUser.mutateAsync(values);
        router.push('/users')
      } 
    
    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />

                <Box 
                    as="form" 
                    onSubmit={handleSubmit(handleCreateUser)}
                    flex="1" 
                    borderRadius={8} 
                    bg="gray.800"
                    p={["6","8"]}
                >
                    <Heading size="lg">Criar usuário</Heading>

                    <Divider my="6" borderColor="gray.700"/>

                    <VStack spacing={["6","8"]}>
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} w="100%">
                            <Input name="name" {...register('name')} error={errors.name} label="Nome Completo"/>
                            <Input name="email" {...register('email')} error={errors.email} type="email" label="E-mail"/>
                        </SimpleGrid>
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} w="100%">
                            <Input name="password" {...register('password')} error={errors.password}  type="password" label="Senha"/>
                            <Input name="password_confirmation" {...register('password_confirmation')} error={errors.password_confirmation} type="password" label="Confirmar Senha"/>
                        </SimpleGrid>
                    </VStack>
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users" passHref>
                            <Button colorScheme="whiteAlpha">Cancelar</Button>
                            </Link>
                            <Button isLoading={formState.isSubmitting} type="submit" colorScheme="pink">Salvar</Button>
                        </HStack>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}