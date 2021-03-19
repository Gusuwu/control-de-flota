<?php
class MovilBitacora
{
    public $table = 'MovilBitacora';
    public $fields = 'mobiId
            ,mobiMoviId
            ,mobiMoseId
            ,mobiServId
            ,mobiFecha
            ,mobiObservaciones
            ,mobiOdometro
            ,mobiProximoOdometro
            ,mobiProximaFecha
            ,mobiIdAnterior
            ,mobiIdSiguiente
            ,mobiPendiente
            ,CONVERT(VARCHAR, mobiFechaAlta, 126) mobiFechaAlta
            ,mobiBorrado'; 

    public $join = "LEFT OUTER JOIN MovilServicio ON mobiMoseId = moseId";

    public function get ($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE mobiBorrado = 0";

        $params = null;
        if (isset( $_GET["mobiMoviId"])){
            $params = [$_GET["mobiMoviId"]];
            $sql = $sql . " AND mobiMoviId = ? ";
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
        "UPDATE $this->table SET mobiBorrado = 1 - mobiBorrado
        WHERE mobiId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        
       //file_put_contents("z_jsonGrupoServicio.txt",json_encode(DATA));
       
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
            (mobiMoviId
            ,mobiMoseId
            ,mobiServId
            ,mobiFecha
            ,mobiObservaciones
            ,mobiOdometro
            ,mobiProximoOdometro
            ,mobiProximaFecha
            ,mobiIdAnterior
            ,mobiIdSiguiente
            ,mobiPendiente
            ,mobiFechaAlta
            ,mobiBorrado)
        VALUES (?,?,GETDATE(),0);
        SELECT @@IDENTITY mobiId, CONVERT(VARCHAR, GETDATE(), 126) mobiFechaAlta;",
        [ DATA["mobiMoviId"]
        ,DATA["mobiMoseId"]
        ,DATA["mobiServId"]
        ,DATA["mobiFecha"]
        ,DATA["mobiObservaciones"]
        ,DATA["mobiOdometro"]
        ,DATA["mobiProximoOdometro"]
        ,DATA["mobiProximaFecha"]
        ,DATA["mobiIdAnterior"]
        ,DATA["mobiIdSiguiente"]
        ,DATA["mobiPendiente"]
        ] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["mobiId"] = $row["mobiId"];
        $results["mobiFechaAlta"] = $row["mobiFechaAlta"];
        $results["mobiBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET mobiMoviId = ?
        WHERE mobiId = ?",
        [
            DATA["mobiMoviId"],
            DATA["mobiId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }
}
?> 