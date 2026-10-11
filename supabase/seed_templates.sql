insert into message_templates (category, title, body) values
('Boas-vindas','Boas-vindas após contratação','Olá, {{nome_cliente}}! Bem-vindo à MD BUSINESS. O teu projecto {{nome_projeto}} já está registado no nosso portal. Vamos acompanhar-te em cada etapa.'),
('Pedidos','Confirmação de receção do pedido','Olá, {{nome_cliente}}! Recebemos o teu pedido de orçamento para {{servico}}. A nossa equipa vai analisar e responde em breve com uma proposta.'),
('Pagamento','Instruções de pagamento','Olá, {{nome_cliente}}! Para avançarmos com {{nome_projeto}}, segue as instruções de pagamento na tua área de cliente: {{link_portal}}'),
('Pagamento','Confirmação de receção do comprovativo','Olá, {{nome_cliente}}! Recebemos o teu comprovativo para {{nome_projeto}} e está em verificação. Avisamos assim que for confirmado.'),
('Pagamento','Confirmação de pagamento','Olá, {{nome_cliente}}! O teu pagamento para {{nome_projeto}} foi confirmado. Obrigado — próxima etapa: {{proxima_acao}}.'),
('Materiais','Pedido de logotipo','Olá, {{nome_cliente}}! Para o projecto {{nome_projeto}} precisamos do teu logotipo em boa qualidade (PNG ou ficheiro original). Podes enviar no portal: {{link_portal}}'),
('Materiais','Pedido de fotografias','Olá, {{nome_cliente}}! Precisamos de fotografias para {{nome_projeto}}: {{materiais_pendentes}}. Envia na tua área de cliente: {{link_portal}}'),
('Materiais','Pedido de textos e informações','Olá, {{nome_cliente}}! Faltam-nos textos/informações para {{nome_projeto}}: {{materiais_pendentes}}. Envia pelo portal: {{link_portal}}'),
('Projecto','Atualização do estado do projecto','Olá, {{nome_cliente}}! A equipa da MD BUSINESS está a trabalhar no {{nome_projeto}}. Neste momento estamos na fase {{etapa_atual}}. Próximo passo: {{proxima_acao}}.'),
('Projecto','Pedido de revisão do design','Olá, {{nome_cliente}}! O design de {{nome_projeto}} está pronto para a tua revisão. Vê no portal e diz-nos o que achas: {{link_portal}}'),
('Projecto','Pedido de aprovação','Olá, {{nome_cliente}}! Precisamos da tua aprovação para avançar em {{nome_projeto}}. Vê a última atualização no portal: {{link_portal}}'),
('Projecto','Comunicação de atraso','Olá, {{nome_cliente}}! Informamos que {{nome_projeto}} teve um pequeno atraso na etapa {{etapa_atual}}. Nova previsão: {{data_prevista}}. Obrigado pela compreensão.'),
('Projecto','Notificação de conclusão','Olá, {{nome_cliente}}! O {{nome_projeto}} está concluído! Vê o resultado final no portal: {{link_portal}}'),
('Entrega','Entrega do website','Olá, {{nome_cliente}}! O teu website {{nome_projeto}} foi entregue e publicado. Obrigado por trabalhares connosco — MD BUSINESS.'),
('Feedback','Pedido de feedback','Olá, {{nome_cliente}}! Esperamos que estejas satisfeito com {{nome_projeto}}. A tua opinião ajuda-nos a melhorar — podes responder a esta mensagem com o teu feedback.')
on conflict do nothing;
