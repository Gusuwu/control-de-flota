<?php
class MovilGrupo
{
    public $table = 'MovilGrupo';
    public $fields = 'mogrId
            ,mogrMoviId
            ,mogrGrupId
            ,CONVERT(VARCHAR, mogrFechaAlta, 126) mogrFechaAlta
            ,mogrBorrado
            ,grupNombre'; 

    public $join = "LEFT OUTER JOIN Grupo ON mogrGrupId = grupId";

    public function get ($db) {
        $sql = "SELECT TOP (1000) $this->fields FROM $this->table
                $this->join
                WHERE mogrBorrado = 0";

        $params = null;
        if (isset( $_GET["mogrMoviId"])){
            $params = [$_GET["mogrMoviId"]];
            $sql = $sql . " AND mogrMoviId = ? ";
        };


        $stmt = SQL::query($db, $sql, $params);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET mogrBorrado = 1 - mogrBorrado
        WHERE mogrId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        
       //file_put_contents("z_jsonGrupoServicio.txt",json_encode(DATA));
       
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
            (mogrMoviId
            ,mogrGrupId
            ,mogrFechaAlta
            ,mogrBorrado)
        VALUES (?,?,GETDATE(),0);
        SELECT @@IDENTITY mogrId, CONVERT(VARCHAR, GETDATE(), 126) mogrFechaAlta;",
        [ DATA["mogrMoviId"]
        ,DATA["mogrGrupId"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["mogrId"] = $row["mogrId"];
        $results["mogrFechaAlta"] = $row["mogrFechaAlta"];
        $results["mogrBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET mogrGrupId = ?
        WHERE mogrId = ?",
        [
            DATA["mogrGrupId"],
            DATA["mogrId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }
}
?> 