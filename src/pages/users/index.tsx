import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Text, Tbody, Td, Th, Thead, Tr, useBreakpointValue, Spinner, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { useUsers } from "../../services/hooks/useUsers";
import { queryClient } from '../../services/queryCliente';

export default function UserList() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching, error } = useUsers(page);

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    async function handlePrefetchUser(userId: number) {
        await queryClient.prefetchQuery(['user', userId], async () => {
            const response = await api.get(`users/${userId}`)

            return response.data;
        }), {
            staleTime: 1000 * 60 * 10 // 10 min
        }
    }

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />

                <Box flex="1" borderRadius={8} bg="gray.800" p="8">
                    <Flex mb="8" justify="space-between" align="center"> 
                        <Heading size="lg" fontWeight="normal">
                            Usuarios
                            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
                        </Heading>
                        <NextLink href="/users/create" passHref>
                            <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon fontSize="20" as={RiAddLine}/>} >
                                Criar novo
                            </Button>
                        </NextLink>
                    </Flex>

                    { isLoading ? (
                        <Flex justify="center">
                            <Spinner />
                        </Flex>
                    ) : error ? (
                        <Flex justify="center">
                            <Text>Erro ao obter dados</Text>
                        </Flex>
                    ) : (
                        <>
                            <Table colorScheme="whiteAlpha">
                                <Thead>
                                    <Tr>
                                        <Th px={["4", "4", "6"]} color="gray.300" width="8">
                                            <Checkbox colorScheme="pink"></Checkbox>
                                        </Th>
                                        <Th>Usuário</Th>
                                        {isWideVersion && <Th>Data de cadastro</Th>}
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.users.map(user => (
                                        <Tr key={user.id}>
                                            <Td px={["4", "4", "6"]}>
                                                <Checkbox colorScheme="pink"></Checkbox>
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Link color="purple.400" onMouseEnter={() => {handlePrefetchUser(Number(user.id))}}>
                                                        <Text fontWeight="bold">{user.name}</Text>
                                                    </Link>
                                                    <Text fontSize="sm" color="gray.300">{user.email}</Text>
                                                </Box>
                                            </Td>
                                            {isWideVersion && <Td>{user.createdAt}</Td>}
                                            
                                            <Td>
                                            {isWideVersion &&
                                                <Button as="a" size="sm" fontSize="sm" colorScheme="purple" leftIcon={<Icon fontSize="16" as={RiPencilLine}/>} >
                                                    Editar
                                                </Button>
                                            }
                                            </Td>
                                        </Tr>
                                    ))}
                                    
                                </Tbody>
                            </Table>
                            <Pagination
                                totalCountOfRegisters={data.totalCount}
                                currentPage={page}
                                onPageChange={setPage}
                            />
                        </>)
                    }  
                </Box>
            </Flex>
        </Box>
    )
}