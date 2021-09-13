select 
t0001_nomefantasia as Nome,
sum(QTDNotaServico) as QTDNotaServico,
sum(QTDNotaMercadoria) as QTDNotaMercadoria,
sum(QTDCompromisso) as QTDCompromisso,
sum(QTDPessoas) as QTDPessoas,
sum(QTDMovimento) as QTDMovimento,
sum(QTDContrato) as QTDContrato,
sum(QTDBoleto) as QTDBoleto,
sum(QTDRemessas) as QTDRemessas,
sum(QTDUsuario) as QTDUsuario

from (


select 
t0001_empresa.t0001_nomefantasia,
COUNT(T0007_Notaservico_ID) as QTDNotaServico, 
0 as QTDNotaMercadoria,
0 as QTDCompromisso,
0 as QTDPessoas,
0 as QTDMovimento,
0 as QTDContrato,
0 as QTDBoleto,
0 as QTDRemessas,
0 as QTDUsuario
from t0001_empresa
left join t0007_notaservico  on t0007_notaservico.t0000_empresa03  = t0001_empresa.t0000_empresa03 and isnull(t0007_notaservico.t0000_flagdeleted,0)=0
where t0007_notaservico.t0000_datainclusao between @dataInicio and @dataFim or t0007_notaservico.t0000_datainclusao is null
group by t0001_nomefantasia

union

select 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
COUNT(T0007_Lotenfe_ID) as QTDNotaMercadoria,
0 as QTDCompromisso,
0 as QTDPessoas,
0 as QTDMovimento,
0 as QTDContrato,
0 as QTDBoleto,
0 as QTDRemessas,
0 as QTDUsuario
from t0001_empresa
left join t0007_lotenfe on t0007_lotenfe.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0007_lotenfe.t0000_flagdeleted,0)=0
where t0007_lotenfe.t0000_datainclusao between @dataInicio and @dataFim or t0007_lotenfe.t0000_datainclusao is null
group by t0001_nomefantasia

union 

select 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
0 as QTDNotaMercadoria,
COUNT(T0008_Compromisso_ID) as QTDCompromisso,
0 as QTDPessoas,
0 as QTDMovimento,
0 as QTDContrato,
0 as QTDBoleto,
0 as QTDRemessas,
0 as QTDUsuario

from t0001_empresa
left join t0008_compromisso on t0008_compromisso.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0008_compromisso.t0000_flagdeleted,0)=0
where t0008_compromisso.t0000_datainclusao between @dataInicio and @dataFim or t0008_compromisso.t0000_datainclusao is null
group by t0001_nomefantasia

union 

select 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
0 as QTDNotaMercadoria,
0 as  QTDCompromisso,
COUNT(T0006_Pessoas_ID) as QTDPessoas,
0 as QTDMovimento,
0 as QTDContrato,
0 as QTDBoleto,
0 as QTDRemessas,
0 as QTDUsuario

from t0001_empresa
left join t0006_pessoas on t0006_pessoas.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0006_pessoas.t0000_flagdeleted,0)=0
where t0006_pessoas.t0000_datainclusao between @dataInicio and @dataFim or t0006_pessoas.t0000_datainclusao is null
group by t0001_nomefantasia

union


select 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
0 as QTDNotaMercadoria,
0 as  QTDCompromisso,
0 as QTDPessoas,
COUNT(t0008_movimento_id) as QTDMovimento,
0 as QTDContrato,
0 as QTDBoleto,
0 as QTDRemessas,
0 as QTDUsuario

from t0001_empresa
left join t0008_movimento on t0008_movimento.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0008_movimento.t0000_flagdeleted,0)=0
and T0008_Tipodetalheparcela_ID in (1,2,3,4,5,9,10,11,12,13,14,15,51,52,54)
where t0008_movimento.t0000_datainclusao between @dataInicio and @dataFim or t0008_movimento.t0000_datainclusao is null
group by t0001_nomefantasia


union


select 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
0 as QTDNotaMercadoria,
0 as  QTDCompromisso,
0 as QTDPessoas,
0 as QTDMovimento,
COUNT(t0012_documentoMkt_id) as QTDContrato,
0 as QTDBoleto,
0 as QTDRemessas,
0 as QTDUsuario

from t0001_empresa
left join t0012_documentoMkt on t0012_documentoMkt.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0012_documentoMkt.t0000_flagdeleted,0)=0
where t0012_documentoMkt.t0000_datainclusao between @dataInicio and @dataFim or t0012_documentoMkt.t0000_datainclusao is null
group by t0001_nomefantasia

union


select 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
0 as QTDNotaMercadoria,
0 as  QTDCompromisso,
0 as QTDPessoas,
0 as QTDMovimento,
0 as QTDContrato,
COUNT(t0008_qtdparcela) as QTDBoleto,
0 as QTDRemessas,
0 as QTDUsuario

from t0001_empresa
left join t0008_agendamentoboletoCnab on t0008_agendamentoboletoCnab.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0008_agendamentoboletoCnab.t0000_flagdeleted,0)=0
where t0008_agendamentoboletoCnab.t0000_datainclusao between @dataInicio and @dataFim or t0008_agendamentoboletoCnab.t0000_datainclusao is null
group by t0001_nomefantasia

union


select 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
0 as QTDNotaMercadoria,
0 as  QTDCompromisso,
0 as QTDPessoas,
0 as QTDMovimento,
0 as QTDContrato,
0 as QTDBoleto,
COUNT(T0010_Arquivointegracaobancaria_ID) as QTDRemessas,
0 as QTDUsuario

from t0001_empresa
left join t0010_arquivointegracaobancaria on t0010_arquivointegracaobancaria.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0010_arquivointegracaobancaria.t0000_flagdeleted,0)=0
where t0010_arquivointegracaobancaria.t0000_datainclusao between @dataInicio and @dataFim or t0010_arquivointegracaobancaria.t0000_datainclusao is null 
and (RIGHT(t0010_arquivointegracaobancaria.T0010_nome,3) = 'RET' OR RIGHT(t0010_arquivointegracaobancaria.T0010_nome,3) = 'REM')
group by t0001_nomefantasia

union


select distinct 
t0001_empresa.t0001_nomefantasia,
0 as QTDNotaServico,
0 as QTDNotaMercadoria,
0 as  QTDCompromisso,
0 as QTDPessoas,
0 as QTDMovimento,
0 as QTDContrato,
0 as QTDBoleto,
0 as QTDRemessas,
count(t0001_usuarioempresa.T0001_Usuario_ID) as QTDUsuario

from t0001_empresa
inner join t0001_usuarioempresa on t0001_usuarioempresa.t0000_empresa03 = t0001_empresa .t0000_empresa03 and isnull(t0001_usuarioempresa.t0000_flagdeleted,0)=0 
inner join t0001_usuario on t0001_usuario.T0001_Usuario_ID = t0001_usuarioempresa.T0001_Usuario_ID and isnull(t0001_usuario.t0000_inativo,0) = 0
where t0001_usuarioempresa.t0000_datainclusao between @dataInicio and @dataFim or t0001_usuarioempresa.t0000_datainclusao is null 
group by t0001_nomefantasia

) ff  

group by 
t0001_nomefantasia