
select 
T0001_Empresa_ID as id,
sum(QTDRetencao) as QTDRetencao,
sum(QTDServico) as QTDServico,
sum(QTDGrupo) as QTDGrupo,
sum(QTDUsuarioGrupo) as QTDUsuarioGrupo,
sum(QTDAcesso) as QTDAcesso
from (


select 
t0001_empresa.T0001_Empresa_ID,
COUNT(T0008_Regraretencao_ID) as QTDRetencao, 
0 as QTDServico,
0 as QTDGrupo,
0 as QTDUsuarioGrupo,
0 as QTDAcesso
from t0001_empresa
left join t0008_regraretencao  on t0008_regraretencao.t0000_empresa03  = t0001_empresa.t0000_empresa03 and isnull(t0008_regraretencao.t0000_flagdeleted,0)=0
group by T0001_Empresa_ID

union 

select 
t0001_empresa.T0001_Empresa_ID,
0 as QTDRetencao, 
COUNT(T0007_Servicomunicipio_ID) as QTDServico,
0 as QTDGrupo,
0 as QTDUsuarioGrupo,
0 as QTDAcesso
from t0001_empresa
left join t0007_servicomunicipio  on t0007_servicomunicipio.t0000_empresa03  = t0001_empresa.t0000_empresa03 and isnull(t0007_servicomunicipio.t0000_flagdeleted,0)=0
group by T0001_Empresa_ID

union 

select 
t0001_empresa.T0001_Empresa_ID,
0 as QTDRetencao, 
0 as QTDServico,
COUNT(T0001_GrupoAcesso_ID) as QTDGrupo,
0 as QTDUsuarioGrupo,
0 as QTDAcesso
from t0001_empresa
left join t0001_grupoacesso  on t0001_grupoacesso.t0000_empresa03  = t0001_empresa.t0000_empresa03 and isnull(t0001_grupoacesso.t0000_flagdeleted,0)=0
group by T0001_Empresa_ID

union 

select 
t0001_empresa.T0001_Empresa_ID,
0 as QTDRetencao, 
0 as QTDServico,
0 as QTDGrupo,
COUNT(T0001_UsuarioGrupoAcesso_ID) as QTDUsuarioGrupo,
0 as QTDAcesso
from t0001_empresa
left join t0001_usuariogrupoacesso on t0001_usuariogrupoacesso.t0000_empresa03  = t0001_empresa.t0000_empresa03 and isnull(t0001_usuariogrupoacesso.t0000_flagdeleted,0)=0
group by T0001_Empresa_ID

union 

select 
t0001_empresa.T0001_Empresa_ID,
0 as QTDRetencao, 
0 as QTDServico,
0 as QTDGrupo,
0 as QTDUsuarioGrupo,
COUNT (T0001_Acesso_ID) as QTDAcesso
from t0001_empresa
left join t0001_acesso on t0001_acesso.t0000_empresa03  = t0001_empresa.t0000_empresa03 and isnull(t0001_acesso.t0000_flagdeleted,0)=0
group by T0001_Empresa_ID

) ff
group by 
T0001_Empresa_ID
